import { cn } from "@/lib/utils";
import Image from "next/image";

export function DynamicIconLogo({
  alt,
  width = 32,
  height = 32,
  className,
  ...props
}: {
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <>
      <Image
        src={"./ligth-icon.svg"}
        alt={alt}
        className={cn("hidden dark:block", className)}
        width={width}
        height={height}
        {...props}
      />
      <Image
        width={width}
        height={height}
        src={"./dark-icon.svg"}
        alt={alt}
        className={cn("dark:hidden", className)}
        {...props}
      />
    </>
  );
}
