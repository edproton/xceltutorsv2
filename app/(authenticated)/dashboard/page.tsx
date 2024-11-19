"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GitHubLogoIcon,
  EnvelopeClosedIcon,
  BellIcon,
  ChatBubbleIcon,
  CircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CURRENT_VERSION = "0.2.2";

// Uptime data for the last 30 days (example data with lower uptime)
const uptimeData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toISOString().split("T")[0],
  uptime: 60 + Math.random() * 10,
}));

// You would typically fetch this data from GitHub's API
const issues = [
  {
    id: 1,
    title: "Stripe Integration: Payment Webhook Setup",
    status: "in-progress",
    priority: "high",
    assignee: "edproton",
    created: "2024-01-19",
  },
  {
    id: 2,
    title: "LessonSpace: Virtual Classroom Integration",
    status: "todo",
    priority: "high",
    assignee: "edproton",
    created: "2024-01-19",
  },
  {
    id: 3,
    title: "Booking Management Types Implementation",
    status: "in-review",
    priority: "medium",
    assignee: "edproton",
    created: "2024-01-19",
  },
  {
    id: 4,
    title: "Kysely Integration Setup",
    status: "in-progress",
    priority: "high",
    assignee: "edproton",
    created: "2024-01-20",
  },
  {
    id: 5,
    title: "Supabase RLS Policy Configuration",
    status: "todo",
    priority: "high",
    assignee: "edproton",
    created: "2024-01-20",
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">xceltutors Dashboard</h1>
          <Badge variant="secondary" className="mt-2">
            Beta
          </Badge>
        </div>
        <Badge variant="outline" className="text-sm">
          Version {CURRENT_VERSION}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beta-info">Beta Information</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Beta Users
                </CardTitle>
                <BellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Sessions
                </CardTitle>
                <BellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180 since last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Feedback Received
                </CardTitle>
                <ChatBubbleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+129</div>
                <p className="text-xs text-muted-foreground">
                  48 addressed this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Uptime
                </CardTitle>
                <BellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">60.0%</div>
                <p className="text-xs text-muted-foreground">
                  Over the last 30 days
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Development Issues</h2>
                  <p className="text-sm text-muted-foreground">
                    Track ongoing development from{" "}
                    <a
                      href="https://github.com/edproton/xceltutorsv2"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      xceltutorsv2
                    </a>
                  </p>
                </div>
                <Badge variant="outline">{issues.length} active</Badge>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {issue.title}
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                              {issue.status === "in-progress" && (
                                <Badge variant="secondary">
                                  <CircleIcon className="mr-1 h-3 w-3 animate-pulse text-primary" />
                                  In Progress
                                </Badge>
                              )}
                              {issue.status === "todo" && (
                                <Badge variant="outline">
                                  <ClockIcon className="mr-1 h-3 w-3" />
                                  Todo
                                </Badge>
                              )}
                              {issue.status === "in-review" && (
                                <Badge>
                                  <CircleIcon className="mr-1 h-3 w-3" />
                                  In Review
                                </Badge>
                              )}
                              {issue.priority === "high" && (
                                <Badge variant="destructive">
                                  <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
                                  High Priority
                                </Badge>
                              )}
                              {issue.priority === "medium" && (
                                <Badge variant="secondary">
                                  Medium Priority
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-muted-foreground">
                              @{issue.assignee}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {issue.created}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>
                  Current progress on major integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Stripe Integration</div>
                    <div>60%</div>
                  </div>
                  <Progress value={60} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">LessonSpace Integration</div>
                    <div>45%</div>
                  </div>
                  <Progress value={45} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Kysely Integration</div>
                    <div>30%</div>
                  </div>
                  <Progress value={30} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Supabase RLS Setup</div>
                    <div>20%</div>
                  </div>
                  <Progress value={20} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>System Uptime (Last 30 Days)</CardTitle>
              <CardDescription>
                Interactive chart showing daily system uptime percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  uptime: {
                    label: "Uptime",
                    color: "hsl(142, 76%, 36%)", // A green color
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={uptimeData}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                      interval="preserveStartEnd"
                      tickCount={5}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                      domain={[55, 75]}
                      tickCount={6}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="uptime"
                      stroke="hsl(142, 76%, 36%)"
                      fill="hsl(142, 76%, 36%)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="beta-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Beta Users!</CardTitle>
              <CardDescription>
                Important information for our beta testers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{"What's New"}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Implemented basic Stripe integration for test payments
                  </li>
                  <li>Added preliminary LessonSpace virtual classrooms</li>
                  <li>
                    Initiated Kysely integration for improved database queries
                  </li>
                  <li>Started Supabase RLS setup for enhanced data security</li>
                  <li>Improved user profile management</li>
                  <li>Enhanced search functionality for tutors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Known Issues</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    System uptime currently lower than expected (around 60%)
                  </li>
                  <li>Occasional lag in video calls on certain browsers</li>
                  <li>Mobile responsiveness issues on some pages</li>
                  <li>Timezone discrepancies in scheduling for some users</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Feedback Guidelines</h3>
                <p>
                  Your feedback is crucial! Please report any bugs, issues, or
                  suggestions through the following channels:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Use the in-app feedback form (preferred method)</li>
                  <li>Email us at feedback@xceltutors.com</li>
                  <li>
                    Join our weekly feedback calls (check your email for
                    invites)
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <ChatBubbleIcon className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Features</CardTitle>
              <CardDescription>
                What to expect in future updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Advanced analytics dashboard for tutors</li>
                <li>Integrated homework submission and grading system</li>
                <li>AI-powered study recommendations</li>
                <li>Mobile app for on-the-go learning</li>
                <li>Expanded subject offerings and specialized courses</li>
                <li>Full Kysely integration for optimized database queries</li>
                <li>
                  Complete Supabase RLS implementation for robust data
                  protection
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Stay Connected</CardTitle>
            <CardDescription>
              Follow our progress and get in touch
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button variant="outline" className="w-full sm:w-auto">
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              GitHub Repository
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              For inquiries: hello@xceltutors.com
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
