import Image from "next/image";

export function HeaderLogo() {
  return (
    <Image
      src="/headerlogo.png"
      alt="Logo Element Hunter"
      width={48}
      height={48}
      priority
      className="rounded-full"
    />
  );
}
