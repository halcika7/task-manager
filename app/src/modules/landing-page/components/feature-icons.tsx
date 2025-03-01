'use client';

import {
  Calendar,
  Clock,
  Filter,
  Kanban,
  LayoutGrid,
  ListTodo,
  Tags,
  Users,
} from 'lucide-react';

interface FeatureIconsProps {
  iconKey: string;
}

export default function FeatureIcons({ iconKey }: FeatureIconsProps) {
  const icons = {
    taskOrganization: <ListTodo className="h-6 w-6 text-purple-500" />,
    teamCollaboration: <Users className="h-6 w-6 text-purple-500" />,
    kanbanBoards: <Kanban className="h-6 w-6 text-purple-500" />,
    timeTracking: <Clock className="h-6 w-6 text-purple-500" />,
    smartFilters: <Filter className="h-6 w-6 text-purple-500" />,
    calendarView: <Calendar className="h-6 w-6 text-purple-500" />,
    customTags: <Tags className="h-6 w-6 text-purple-500" />,
    multipleViews: <LayoutGrid className="h-6 w-6 text-purple-500" />,
  };

  return icons[iconKey as keyof typeof icons] || null;
}
