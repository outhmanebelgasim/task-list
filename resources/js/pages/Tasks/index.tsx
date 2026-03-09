import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    List as ListIcon,
    Pencil,
    Plus,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    list: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks', href: '/tasks' }];

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<
        'all' | 'completed' | 'pending'
    >(filters.filter as 'all' | 'completed' | 'pending');

    useEffect(() => {
        if (flash?.success) {
            const msg = flash.success;
            queueMicrotask(() => {
                setToastMessage(msg);
                setToastType('success');
                setShowToast(true);
            });
        } else if (flash?.error) {
            const msg = flash.error;
            queueMicrotask(() => {
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            });
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false as boolean,
    });

    const handleCreateNew = () => {
        setEditingTask(null);
        reset();
        setData({
            title: '',
            description: '',
            due_date: '',
            list_id: lists[0]?.id?.toString() ?? '',
            is_completed: false,
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.list_id) return;
        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleToggleComplete = (task: Task) => {
        router.put(route('tasks.update', task.id), {
            title: task.title,
            description: task.description ?? '',
            due_date: task.due_date ?? '',
            list_id: task.list.id,
            is_completed: !task.is_completed,
        });
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list.id.toString(),
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };

    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            route('tasks.index'),
            {
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(
            route('tasks.index'),
            {
                search: searchTerm,
                filter: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('tasks.index'),
            {
                page,
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                {/* Toast */}
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg ${
                            toastType === 'success'
                                ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/90 dark:text-green-200'
                                : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/90 dark:text-red-200'
                        } animate-in slide-in-from-top-5 fade-in`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                        ) : (
                            <XCircle className="h-5 w-5 shrink-0" />
                        )}
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Tasks
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your tasks across lists
                        </p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={handleCreateNew}
                                size="sm"
                                className="shadow-sm"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingTask
                                        ? 'Edit Task'
                                        : 'Create New Task'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="task-title">Title</Label>
                                    <Input
                                        id="task-title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Task title"
                                        required
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="task-description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="task-description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Optional description"
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="task-due">Due date</Label>
                                    <Input
                                        id="task-due"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>List</Label>
                                    <Select
                                        value={data.list_id}
                                        onValueChange={(v) =>
                                            setData('list_id', v)
                                        }
                                        required
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lists.map((list) => (
                                                <SelectItem
                                                    key={list.id}
                                                    value={list.id.toString()}
                                                >
                                                    {list.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {editingTask && (
                                    <div className="flex items-center gap-2 rounded-md border p-3">
                                        <input
                                            type="checkbox"
                                            id="task-completed"
                                            checked={data.is_completed}
                                            onChange={(e) =>
                                                setData(
                                                    'is_completed',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-input"
                                        />
                                        <Label
                                            htmlFor="task-completed"
                                            className="cursor-pointer font-normal"
                                        >
                                            Mark as completed
                                        </Label>
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {editingTask ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search & Filter */}
                <Card className="border-muted/50">
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 sm:flex-row sm:items-end"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by title or description..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="h-9 pl-9"
                                />
                            </div>
                            <Select
                                value={completionFilter}
                                onValueChange={(v) =>
                                    handleFilterChange(
                                        v as 'all' | 'completed' | 'pending',
                                    )
                                }
                            >
                                <SelectTrigger className="h-9 w-full sm:w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                className="h-9"
                            >
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Task list */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tasks.data.map((task) => (
                        <Card
                            key={task.id}
                            className={`overflow-hidden transition-all hover:shadow-md ${
                                task.is_completed ? 'opacity-90' : ''
                            }`}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-start gap-3 p-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mt-0.5 h-8 w-8 shrink-0 rounded-full"
                                        onClick={() =>
                                            handleToggleComplete(task)
                                        }
                                        aria-label={
                                            task.is_completed
                                                ? 'Mark incomplete'
                                                : 'Mark complete'
                                        }
                                    >
                                        {task.is_completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </Button>
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0">
                                            <CardTitle
                                                className={`text-base leading-tight font-medium ${
                                                    task.is_completed
                                                        ? 'text-muted-foreground line-through'
                                                        : 'text-foreground'
                                                }`}
                                            >
                                                {task.title}
                                            </CardTitle>
                                            <div className="flex shrink-0 gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        handleEdit(task)
                                                    }
                                                    aria-label="Edit task"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(task.id)
                                                    }
                                                    aria-label="Delete task"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        {task.list && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <ListIcon className="h-3.5 w-3 shrink-0" />
                                                <span>{task.list.title}</span>
                                            </div>
                                        )}
                                        {task.description && (
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {task.description}
                                            </p>
                                        )}
                                        {task.due_date && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3 shrink-0" />
                                                {new Date(
                                                    task.due_date,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        dateStyle: 'medium',
                                                    },
                                                )}
                                            </div>
                                        )}
                                        {task.is_completed && (
                                            <Badge
                                                variant="secondary"
                                                className="mt-1 text-xs"
                                            >
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty state */}
                {tasks.data.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-3 font-medium text-foreground">
                                No tasks yet
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create a task or adjust your search and filter.
                            </p>
                            <Button
                                onClick={handleCreateNew}
                                variant="outline"
                                size="sm"
                                className="mt-4"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {tasks.last_page > 1 && (
                    <Card className="border-muted/50">
                        <CardContent className="flex flex-row items-center justify-between gap-4 py-4">
                            <p className="text-sm text-muted-foreground">
                                Showing{' '}
                                <span className="font-medium text-foreground">
                                    {tasks.from}
                                </span>
                                {' – '}
                                <span className="font-medium text-foreground">
                                    {tasks.to}
                                </span>
                                {' of '}
                                <span className="font-medium text-foreground">
                                    {tasks.total}
                                </span>
                                {' tasks'}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={tasks.current_page <= 1}
                                    onClick={() =>
                                        handlePageChange(tasks.current_page - 1)
                                    }
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="min-w-[6rem] text-center text-sm text-muted-foreground">
                                    Page {tasks.current_page} of{' '}
                                    {tasks.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={
                                        tasks.current_page >= tasks.last_page
                                    }
                                    onClick={() =>
                                        handlePageChange(tasks.current_page + 1)
                                    }
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
