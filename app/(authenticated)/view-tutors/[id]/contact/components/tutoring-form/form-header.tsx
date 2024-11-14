export default function FormHeader({ tutorName }: { tutorName: string }) {
  return (
    <div className="space-y-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Reach out to {tutorName}
      </h1>
      <p className="text-base text-muted-foreground sm:text-lg">
        {`Find out whether ${tutorName} is the tutor you're looking for by dropping
        a message and requesting a 15min video meeting (it's free)`}
      </p>
    </div>
  );
}
