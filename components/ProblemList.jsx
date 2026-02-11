'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function ProblemList({ problems, emptyMessage = "No problems found." }) {
    if (!problems || problems.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {problems.map((problem) => (
                <Link href={`/problem/${problem.id}`} key={problem.id} className="block group">
                    <Card className="transition-all hover:bg-accent/50 hover:border-primary/50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium group-hover:text-primary transition-colors">
                                        {problem.leetcode_link.replace('https://leetcode.com/problems/', '').replace(/\/$/, '')}
                                    </span>
                                    <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                                </div>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    {problem.topics.map((topic) => (
                                        <span key={topic} className="px-1.5 py-0.5 bg-muted rounded">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className={cn(
                                    "text-xs capitalize",
                                    problem.revisit_status === 'soon' && "border-red-500 text-red-500",
                                    problem.revisit_status === 'later' && "border-yellow-500 text-yellow-500",
                                    problem.revisit_status === 'no' && "border-green-500 text-green-500"
                                )}>
                                    Recall: {problem.revisit_status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Conf: {problem.confidence_score}/5
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
