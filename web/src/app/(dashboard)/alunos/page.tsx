import { auth } from "../../../../auth";

export default async function AlunosPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return <div></div>;
}
