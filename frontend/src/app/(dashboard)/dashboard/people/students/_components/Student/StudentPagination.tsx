"use client"

import Link from "next/link"
import {Button} from "~/components/ui/button"

interface StudentPaginationProps{
    currentPage: number;
    totalPages: number;
}

export function StudentPagination({
    currentPage,
    totalPages
}: StudentPaginationProps){
    return(
        <div className="flex items-center justify-between border-t px-6 py-4">
            <Button
            asChild
            variant="outline"
            disabled={currentPage <= 1}
            >
                <Link
                    href={`/dashboard/people/students?page=${currentPage - 1}`}
                >
                    Previous
                </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
            </p>
            <Button
                asChild
                variant="outline"
                disabled={currentPage >= totalPages}
            >
                <Link
                    href={`/dashboard/people/students?page=${currentPage + 1}`}
                >
                    Next
                </Link>
            </Button>
        </div>
    );
}