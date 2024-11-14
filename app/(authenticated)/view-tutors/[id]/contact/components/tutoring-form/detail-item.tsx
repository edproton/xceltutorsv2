interface DetailItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function DetailItem({ icon, value, label }: DetailItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
