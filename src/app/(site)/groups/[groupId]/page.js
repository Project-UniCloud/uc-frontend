export default async function GroupPage({ params }) {
  const { groupId } = await params;

  return (
    <div>
      <h1>Group: {groupId}</h1>
      <p>Welcome to the group page</p>
    </div>
  );
}
