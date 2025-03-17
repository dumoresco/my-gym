import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
