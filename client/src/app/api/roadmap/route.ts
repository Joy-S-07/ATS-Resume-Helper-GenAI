import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Simulate LLM generation delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock generated tasks based on the role
    const tasks = [
      {
        id: '1',
        title: `Understand the Fundamentals of ${role}`,
        description: `Learn the core concepts and basic principles required for a ${role}.`,
        status: 'pending',
        priority: 'high',
        level: 0,
        dependencies: [],
        subtasks: [
          {
            id: '1.1',
            title: 'Research key responsibilities',
            description: `Understand what a ${role} does on a daily basis.`,
            status: 'pending',
            priority: 'high',
            tools: ['browser', 'search'],
          },
          {
            id: '1.2',
            title: 'Identify core technologies',
            description: `List the primary tools and technologies used by a ${role}.`,
            status: 'pending',
            priority: 'medium',
          },
        ],
      },
      {
        id: '2',
        title: 'Master the Essential Tools',
        description: `Get hands-on experience with the specific tools used by a ${role}.`,
        status: 'pending',
        priority: 'high',
        level: 0,
        dependencies: ['1'],
        subtasks: [
          {
            id: '2.1',
            title: 'Set up development environment',
            description: 'Install and configure all necessary software.',
            status: 'pending',
            priority: 'high',
          },
          {
            id: '2.2',
            title: 'Build a small prototype',
            description: 'Create a "Hello World" project to verify your setup.',
            status: 'pending',
            priority: 'medium',
          },
        ],
      },
      {
        id: '3',
        title: 'Build a Portfolio Project',
        description: `Showcase your skills as a ${role} with a real-world project.`,
        status: 'pending',
        priority: 'high',
        level: 1,
        dependencies: ['1', '2'],
        subtasks: [
          {
            id: '3.1',
            title: 'Plan the project scope',
            description: 'Define the features and requirements of your portfolio piece.',
            status: 'pending',
            priority: 'high',
          },
          {
            id: '3.2',
            title: 'Implement the project',
            description: 'Write the code and assemble the project.',
            status: 'pending',
            priority: 'high',
          },
          {
            id: '3.3',
            title: 'Deploy and document',
            description: 'Host the project online and write a clear README.',
            status: 'pending',
            priority: 'medium',
          },
        ],
      },
      {
        id: '4',
        title: 'Prepare for ATS and Interviews',
        description: `Optimize your resume and prepare for technical interviews for a ${role} position.`,
        status: 'pending',
        priority: 'medium',
        level: 1,
        dependencies: ['3'],
        subtasks: [
          {
            id: '4.1',
            title: 'Update Resume',
            description: 'Add your new portfolio project and relevant skills to your resume.',
            status: 'pending',
            priority: 'high',
          },
          {
            id: '4.2',
            title: 'Run ATS check',
            description: 'Use the ATS Resume Helper to ensure your resume passes automated screenings.',
            status: 'pending',
            priority: 'high',
          },
          {
            id: '4.3',
            title: 'Mock Interviews',
            description: 'Practice technical questions and behavioral interviews.',
            status: 'pending',
            priority: 'medium',
          },
        ],
      },
    ];

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
