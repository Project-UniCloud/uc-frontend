import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  return !!token;
}

export default async function HomePage() {
  const isAuth = await getUser();

  if (isAuth) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
