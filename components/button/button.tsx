import { ButtonLink } from 'storefront-kit';

interface MSButtonProps {
  className?: string;
  children?: string;
  variant?: 'primary' | 'brand' | 'outline' | 'ghost' | 'danger';
  size?: '2x-small' | 'x-small' | 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'pill' | 'square' | 'circle';
  link: { href: string; target?: '_blank' | '_self' | '_parent' | '_top' };
}

export function MSButton({
  className,
  children,
  variant,
  size,
  shape,
  link,
  ...props
}: MSButtonProps) {
  return (
    <ButtonLink
      className={className}
      href={link.href || '#'}
      shape={shape}
      size={size}
      target={link.target}
      variant={variant}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}
