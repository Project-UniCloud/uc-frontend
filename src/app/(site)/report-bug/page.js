export default async function ReportBugPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div>
      <h1>Report a Bug</h1>
      <p>If you encounter any issues, please report them here.</p>
    </div>
  );
}
