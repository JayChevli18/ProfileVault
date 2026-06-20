interface ProfileDetailProps {
  label: string;
  value: string;
  className?: string;
}

export function ProfileDetail({ label, value, className }: ProfileDetailProps) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
