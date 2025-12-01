# TraceTrail AWS Deployment Guide

This guide explains how the TraceTrail frontend (Next.js) and backend (FastAPI) are built, deployed, and exposed publicly on AWS using ECR, EKS, and the AWS Load Balancer Controller.

---

## 1. Stack detection

| Layer     | Location           | Framework/runtime | Default port | Dockerfile                                   |
|-----------|--------------------|-------------------|--------------|----------------------------------------------|
| Frontend  | `frontend/`        | Next.js 14        | 3000 (dev) / 80 inside container (nginx) | `deployment/Docker/Dockerfile.frontend` |
| Backend   | `backend/src/`     | FastAPI + Uvicorn | 8000         | `deployment/Docker/Dockerfile.backend`       |

Both Dockerfiles are multi-stage builds used locally, in CI, and in production. The frontend image serves the static build through nginx, and the backend image exposes the FastAPI app via Uvicorn.

---

## 2. Kubernetes layout (`deployment/k8s/`)

| File                      | Purpose                                                                                |
|---------------------------|----------------------------------------------------------------------------------------|
| `namespace.yaml`          | Creates the `tracetrail` namespace + ConfigMaps for backend/frontend runtime config.   |
| `backend.yaml`            | Backend `Deployment` (replicas=2) and ClusterIP `Service` on port 8000.                |
| `frontend.yaml`           | Frontend `Deployment` (replicas=2) and ClusterIP `Service` on port 80 → pods listen on 3000 (Next.js SSR). |
| `ingress.yaml`            | AWS ALB Ingress (internet-facing) routing `tracetrail.in`/`www` to the frontend and `api.tracetrail.in` to the backend. |

Secrets (database credentials, API keys, etc.) are **not** stored in Git. Use the template to generate them safely:

```bash
export DATABASE_URL="postgresql+psycopg://USER:PASSWORD@postgres:5432/trace_trail"
export SECRET_KEY="generate-a-64-char-string"
export DB_USER="trace_trail"
export DB_PASSWORD="..."
export DB_HOST="postgres.tracetrail.svc.cluster.local"
export DB_PORT="5432"
export DB_NAME="trace_trail"
export REDIS_URL="redis://redis:6379/0"

envsubst < deployment/k8s/secrets.template.yaml | kubectl apply -f -
```

You only need to run the command again when rotating credentials.

---

## 3. Manual deployment (useful for testing)

```bash
# 1) Ensure kubectl talks to the cluster
aws eks update-kubeconfig --name tracetrail-production --region us-east-1

# 2) Apply manifests
kubectl apply -f deployment/k8s/namespace.yaml
kubectl apply -f deployment/k8s/backend.yaml
kubectl apply -f deployment/k8s/frontend.yaml
kubectl apply -f deployment/k8s/ingress.yaml

# 3) Point workloads to a specific image tag (same logic CI uses)
kubectl -n tracetrail set image deployment/backend \
  backend=<account>.dkr.ecr.us-east-1.amazonaws.com/tracetrail-backend:<tag>
kubectl -n tracetrail set image deployment/frontend \
  frontend=<account>.dkr.ecr.us-east-1.amazonaws.com/tracetrail-frontend:<tag>

# 4) Verify
kubectl get pods -n tracetrail
kubectl get svc -n tracetrail
kubectl get ingress tracetrail-ingress -n tracetrail
```

The ingress status output contains the ALB DNS name (e.g., `k8s-tracetra-1234567890.us-east-1.elb.amazonaws.com`).

---

## 4. GitHub Actions workflow (`.github/workflows/deploy.yml`)

On every **release → published** event the workflow will:

1. Build backend & frontend images using the Dockerfiles under `deployment/Docker/`.
2. Tag them with `${{ github.event.release.tag_name }}` and push to ECR (`tracetrail-backend`, `tracetrail-frontend` repos).
3. Configure `kubectl` either from the `KUBE_CONFIG` secret or via `aws eks update-kubeconfig`.
4. Apply the manifests in `deployment/k8s/`.
5. Update the running `Deployment` objects to the freshly-pushed image tags.
6. Wait for rollout success and notify Slack via `${{ secrets.SLACK_WEBHOOK }}`.

To trigger a deployment, create a GitHub Release (tag) via the UI or CLI; publishing it runs the job automatically.

---

## 5. Retrieving the public URL

```bash
kubectl get ingress tracetrail-ingress -n tracetrail \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

Sample output:

```
k8s-tracetra-ingress-1234567890.us-east-1.elb.amazonaws.com
```

Use this hostname when configuring DNS.

---

## 6. GoDaddy DNS setup for `tracetrail.in`

1. Sign in to GoDaddy → **My Products** → `tracetrail.in` → **DNS**.
2. Under **Records** add:

   | Type  | Name | Value                                                           | TTL   | Notes                                   |
   |-------|------|-----------------------------------------------------------------|-------|-----------------------------------------|
   | CNAME | www  | `<ALB_HOSTNAME>` e.g. `k8s-tracetra-ingress-123...elb.amazonaws.com` | 1 hour | Points the `www` host to the ALB.       |
   | CNAME | api  | `<ALB_HOSTNAME>`                                               | 1 hour | Optional: exposes `api.tracetrail.in`.  |

3. Apex (`@` / root) records cannot be CNAMEs on GoDaddy. Two options:
   - **Forwarding approach**: remove existing `A` record, set **Domain Forwarding** so `tracetrail.in → https://www.tracetrail.in`. Users hitting the root are redirected to `www`.
   - **Recommended**: delegate DNS to Route 53 (below) and use Alias records so the apex can map directly to the ALB without IPs.

Propagation typically takes 5–10 minutes but may take up to 24 hours.

---

## 7. Optional: moving DNS to Route 53

1. Create a public hosted zone in Route 53 for `tracetrail.in`.
2. Add Alias `A` records:

   - `tracetrail.in` → Alias to the ALB (choose from the dropdown).
   - `www.tracetrail.in` → Alias to the same ALB.
   - `api.tracetrail.in` → Alias to the same ALB (or another service if desired).

3. In GoDaddy, replace the default nameservers with the Route 53 nameservers shown in the hosted zone.

Once the registrar updates propagate, all DNS changes are managed from Route 53 and you no longer need HTTP forwarding.

---

## 8. HTTPS / certificates

The ingress expects an ACM certificate ARN in `alb.ingress.kubernetes.io/certificate-arn`. Create a certificate in **us-east-1**, covering:

- `tracetrail.in`
- `www.tracetrail.in`
- `api.tracetrail.in`

Validate it (DNS validation is easiest if using Route 53). After validation, copy the ARN into `deployment/k8s/ingress.yaml` and redeploy. The AWS Load Balancer Controller will terminate TLS on the ALB and forward HTTP traffic to the services inside the cluster.

---

## 9. Troubleshooting checklist

- **Images not found**: confirm the GitHub Actions job pushed the same tag that the deployment references (`kubectl -n tracetrail describe deployment backend`).
- **Pods crashlooping**: check `kubectl logs deployment/backend -n tracetrail` and ensure the secret `tracetrail-backend-secrets` exists.
- **Ingress pending**: verify the AWS Load Balancer Controller is installed in the cluster and the subnets are tagged with `kubernetes.io/role/elb=1`.
- **DNS not resolving**: verify GoDaddy records point to the ALB hostname and wait for propagation; use `nslookup tracetrail.in`.

---

## 10. Health dashboards & alerts

- **Dashboard**: apply `deployment/observability/cloudwatch-dashboard.json` via `aws cloudwatch put-dashboard`. It visualises ALB request/error rate, EKS node utilisation, and backend pod health. Remember to replace `REPLACE_WITH_ALB_SUFFIX`.
- **Alerts**: create an SNS topic (e.g., `tracetrail-alerts`), update the ARNs/placeholders inside `deployment/observability/cloudwatch-alarms.json`, then run:

  ```bash
  jq -c '.[]' deployment/observability/cloudwatch-alarms.json | while read alarm; do
    aws cloudwatch put-metric-alarm --cli-input-json "$alarm"
  done
  ```

Connect the SNS topic to Slack via AWS Chatbot or to email/SMS for immediate notifications when ALB 5xx spikes or pods restart.

That’s it—ship a release tag and the pipeline handles the rest. Happy deployments!

