interface PlatformIconProps {
  platform: string
  size?: number
}

const icons: Record<string, string> = {
  facebook: '/assets/icons/facebook.svg',
  instagram: '/assets/icons/instagram.svg',
  twitter: '/assets/icons/twitter.svg',
  linkedin: '/assets/icons/linkedin.svg',
}

const PlatformIcon = ({ platform, size = 24 }: PlatformIconProps) => {
  const iconSrc = icons[platform.toLowerCase()] || '/assets/icons/default.svg'
  return (
    <img
      src={iconSrc}
      alt={platform}
      width={size}
      height={size}
      className="inline-block"
    />
  )
}

export default PlatformIcon