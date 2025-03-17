"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const DynamicBreadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return [
      ...segments.map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: `/${segments.slice(0, index + 1).join("/")}`,
      })),
    ];
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="font-medium">
              <BreadcrumbLink asChild>
                <Link href={crumb.href || "/"}>{crumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
