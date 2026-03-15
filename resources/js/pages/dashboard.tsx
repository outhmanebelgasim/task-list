import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    List as ListIcon,
    Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats = {
        totalLists: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    },
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="relative flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/40 p-4 sm:p-6">
                {/* Background pattern for light/dark theme */}
                <PlaceholderPattern className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 text-foreground/5 sm:h-56 sm:w-56" />

                {/* Header */}
                <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Overview of your lists and tasks
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-dashed"
                        >
                            <Link href="/lists">
                                <ListIcon className="mr-2 h-4 w-4" />
                                View Lists
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="bg-foreground text-background hover:bg-foreground/90"
                        >
                            <Link href="/tasks">
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-muted/60 bg-card/80 backdrop-blur">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-500 dark:bg-blue-500/15">
                                    <ListIcon className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-sm font-medium">
                                    Total lists
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stats.totalLists}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Total lists you have created
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted/60 bg-card/80 backdrop-blur">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15">
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-sm font-medium">
                                    Total tasks
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stats.totalTasks}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                All tasks across your lists
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted/60 bg-card/80 backdrop-blur">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stats.completedTasks}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks you have finished
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted/60 bg-card/80 backdrop-blur">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stats.pendingTasks}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks waiting for your attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick actions + recent activity */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="border-muted/70 bg-card/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                asChild
                                variant="outline"
                                className="flex w-full items-center justify-start gap-2"
                            >
                                <Link href="/lists">
                                    <ListIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        View all lists
                                    </span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="flex w-full items-center justify-start gap-2"
                            >
                                <Link href="/tasks">
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        View all tasks
                                    </span>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-muted/70 bg-card/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3 rounded-lg border border-dashed border-muted/60 p-3">
                                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Welcome to Task Manager
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Get started by creating your first list
                                        or task.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Empty-state helper when everything is zero */}
                {stats.totalLists === 0 && stats.totalTasks === 0 && (
                    <Card className="border-dashed border-muted/70 bg-card/70 backdrop-blur">
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <p className="font-medium text-foreground">
                                    Get started with your first list
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create a list, then add tasks to track your
                                    work.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/lists">
                                        <ListIcon className="mr-2 h-4 w-4" />
                                        Create a List
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/tasks">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Task
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
