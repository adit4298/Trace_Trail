# Observability assets

This folder contains reusable CloudWatch artefacts for TraceTrail:

| File                                   | Purpose                                                                                  |
|----------------------------------------|------------------------------------------------------------------------------------------|
| `cloudwatch-dashboard.json`            | Multi-widget dashboard covering ALB traffic, EKS node utilisation, and backend pod health. |
| `cloudwatch-alarms.json`               | Sample metric alarm definitions (ALB 5xx spikes, backend pod restarts).                  |

## Applying the dashboard

```bash
aws cloudwatch put-dashboard \
  --dashboard-name TraceTrail-Prod \
  --dashboard-body file://deployment/observability/cloudwatch-dashboard.json
```

**Replace** `REPLACE_WITH_ALB_SUFFIX` with the Load Balancer suffix shown by `kubectl get ingress`. The suffix looks like `app/tracetrail/1234567890abcdef`.

## Creating the alarms

1. Create an SNS topic for notifications (for example `tracetrail-alerts`) and subscribe your Slack webhook via AWS Chatbot or email/SMS endpoints.
2. Update the placeholder account ID, SNS ARN, and ALB suffix inside `cloudwatch-alarms.json`.
3. Apply the alarms with `jq`:

```bash
jq -c '.[]' deployment/observability/cloudwatch-alarms.json | while read alarm; do
  aws cloudwatch put-metric-alarm --cli-input-json "$alarm"
done
```

## Surfacing alerts in Slack

Use AWS Chatbot → configure an SNS subscription to your Slack workspace/channel. Point the alarms’ `AlarmActions` to that SNS topic so Slack receives actionable notifications when health regressions occur.

