
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project } from '@/types/project';
import { Notification } from '@/types/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { PlusCircle, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading, profileLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);
  
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['userProjects', user?.id],
    queryFn: async (): Promise<Project[]> => {
      try {
        const response = await api.get(`/projects/user/${user?.id}`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || 'Failed to fetch projects');
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
  
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      try {
        const response = await api.get(`/notifications/user/${user?.id}`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.error || 'Failed to fetch notifications');
        }
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
  
  const unreadNotifications = notifications?.filter(n => !n.read) || [];
  
  if (loading || profileLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Project
          </Button>
        </Link>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {projects?.length === 1 ? '1 project created' : `${projects?.length || 0} projects created`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {unreadNotifications.length === 1
                ? '1 unread notification'
                : `${unreadNotifications.length} unread notifications`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.role || 'User'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Joined {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : ''}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content tabs */}
      <Tabs defaultValue="projects">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            Notifications
            {unreadNotifications.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          {projectsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : projects?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="mb-4">You haven't created any projects yet.</p>
                <Link to="/create">
                  <Button>Create Your First Project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects?.map(project => (
                <Card key={project.id}>
                  <CardContent className="pt-6 flex justify-between items-center">
                    <div>
                      <Link to={`/idea/${project.id}`} className="text-lg font-medium hover:underline">
                        {project.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{project.description.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {project.stage}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Stats</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notifications">
          {notificationsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : notifications?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                </div>
                <p>You don't have any notifications yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications?.map(notification => (
                <Card key={notification.id} className={notification.read ? 'bg-card' : 'bg-muted'}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {notification.link && (
                        <Link to={notification.link}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
