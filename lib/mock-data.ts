"use client"

import type { BlogPost, FeaturedPost, Category, Stat } from "@/lib/types"

// Blog posts data
export const blogPosts: Record<string, BlogPost> = {
  "what-does-it-take-to-become-a-web-developer": {
    id: 1,
    slug: "what-does-it-take-to-become-a-web-developer",
    title: "What does it take to become a web developer?",
    excerpt:
      "Web development encompasses a variety of tasks and processes involved in creating websites for the internet. It involves various specialized fields, each with its own set of skills and techniques.",
    content: `
      <p>Web development, also known as website development, encompasses a variety of tasks and processes involved in creating websites for the internet. It involves various specialized fields, each with its own set of skills and techniques. While some individuals might view web development as a holistic process, it can be broken down into several key areas that are essential for building a functional and visually appealing website.</p>

      <h3>Frontend Development:</h3>
      <p>Frontend development focuses on the user-facing aspects of a website. It involves creating the visual elements that users interact with directly. Frontend developers use a combination of languages such as HTML, CSS, and JavaScript to build user interfaces, design, and interactivity of the website. They need to have a strong understanding of user experience (UX) and user interface (UI) design to ensure that the website is both aesthetically pleasing and user-friendly.</p>

      <h3>Backend Development:</h3>
      <p>Backend development involves the behind-the-scenes functionality of a website. It includes server-side scripting, databases, and the logic that operates behind the scenes to ensure that the frontend works smoothly. Backend developers work with programming languages such as Ruby, Python, PHP, and Java, and frameworks such as Node.js, Django, and Laravel. They are responsible for building and maintaining the server, application, and database that power the website.</p>

      <h3>Full-Stack Development:</h3>
      <p>Full-stack developers have expertise in both frontend and backend development. They can work on all aspects of a web application, from the user interface to the server-side logic. This versatility makes them valuable team members who can bridge the gap between different aspects of web development.</p>

      <h3>Getting Started:</h3>
      <p>If you're interested in becoming a web developer, here are some steps to get started:</p>
      <ul>
        <li>Learn HTML, CSS, and JavaScript fundamentals</li>
        <li>Choose a frontend framework like React, Vue, or Angular</li>
        <li>Learn a backend language like Node.js, Python, or PHP</li>
        <li>Understand databases and how to work with them</li>
        <li>Build projects to practice your skills</li>
        <li>Create a portfolio to showcase your work</li>
      </ul>

      <p>Remember, becoming a web developer is a journey that requires continuous learning and practice. The field is constantly evolving, so staying up-to-date with new technologies and best practices is essential for success.</p>
    `,
    author: "Ethan Yu",
    date: "16.03.2023",
    readTime: "4 Min",
    views: "2.1k",
    likes: "45",
    comments: "12",
    image: "/placeholder.svg?height=400&width=800",
    category: "Career",
    trending: true,
    featured: true,
  },
  "modern-javascript-frameworks-comparison": {
    id: 2,
    slug: "modern-javascript-frameworks-comparison",
    title: "Modern JavaScript Frameworks Comparison",
    excerpt:
      "Exploring the differences between React, Vue, and Angular to help you choose the right framework for your next project...",
    content: `
      <p>Choosing the right JavaScript framework for your project can be challenging with so many options available. In this comprehensive comparison, we'll explore the three most popular frameworks: React, Vue, and Angular.</p>

      <h3>React</h3>
      <p>React, developed by Facebook, is a library focused on building user interfaces. It's known for its component-based architecture and virtual DOM implementation.</p>
      <ul>
        <li>Large ecosystem and community support</li>
        <li>Flexible and unopinionated</li>
        <li>Great for large-scale applications</li>
        <li>Steep learning curve for beginners</li>
      </ul>

      <h3>Vue.js</h3>
      <p>Vue.js is a progressive framework that's designed to be incrementally adoptable. It's known for its gentle learning curve and excellent documentation.</p>
      <ul>
        <li>Easy to learn and integrate</li>
        <li>Excellent documentation</li>
        <li>Great performance</li>
        <li>Smaller ecosystem compared to React</li>
      </ul>

      <h3>Angular</h3>
      <p>Angular is a full-featured framework developed by Google. It provides a complete solution for building large-scale applications.</p>
      <ul>
        <li>Complete framework with everything included</li>
        <li>Great for enterprise applications</li>
        <li>Strong TypeScript support</li>
        <li>Steep learning curve</li>
      </ul>

      <h3>Conclusion</h3>
      <p>The choice between these frameworks depends on your project requirements, team expertise, and personal preferences. Each has its strengths and is suitable for different types of projects.</p>
    `,
    author: "Ethan Yu",
    date: "12.03.2023",
    readTime: "6 Min",
    views: "1.8k",
    likes: "38",
    comments: "8",
    image: "/placeholder.svg?height=400&width=800",
    category: "JavaScript",
    trending: false,
    featured: false,
  },
  "building-scalable-nodejs-applications": {
    id: 3,
    slug: "building-scalable-nodejs-applications",
    title: "Building Scalable Node.js Applications",
    excerpt:
      "Learn the best practices for creating robust and scalable backend applications using Node.js and Express...",
    content: `
      <p>Node.js has become one of the most popular choices for building scalable backend applications. In this guide, we'll explore the best practices for creating robust and scalable Node.js applications.</p>

      <h3>Architecture Patterns</h3>
      <p>Choosing the right architecture is crucial for scalability. Here are some popular patterns:</p>
      <ul>
        <li>MVC (Model-View-Controller)</li>
        <li>Microservices Architecture</li>
        <li>Layered Architecture</li>
        <li>Event-Driven Architecture</li>
      </ul>

      <h3>Database Optimization</h3>
      <p>Database performance is often the bottleneck in web applications. Consider these optimization techniques:</p>
      <ul>
        <li>Proper indexing strategies</li>
        <li>Connection pooling</li>
        <li>Query optimization</li>
        <li>Caching strategies</li>
      </ul>

      <h3>Error Handling</h3>
      <p>Robust error handling is essential for production applications:</p>
      <ul>
        <li>Use try-catch blocks appropriately</li>
        <li>Implement global error handlers</li>
        <li>Log errors properly</li>
        <li>Graceful error responses</li>
      </ul>

      <h3>Performance Monitoring</h3>
      <p>Monitor your application's performance to identify bottlenecks and optimize accordingly. Use tools like New Relic, DataDog, or custom monitoring solutions.</p>
    `,
    author: "Ethan Yu",
    date: "08.03.2023",
    readTime: "8 Min",
    views: "1.5k",
    likes: "32",
    comments: "15",
    image: "/placeholder.svg?height=400&width=800",
    category: "Backend",
    trending: false,
    featured: false,
  },
  "react-performance-optimization": {
    id: 4,
    slug: "react-performance-optimization",
    title: "React Performance Optimization Techniques",
    excerpt:
      "Discover advanced techniques to optimize your React applications for better performance and user experience...",
    content: `
      <p>React is known for its virtual DOM and efficient rendering, but as applications grow in complexity, performance can become an issue. In this article, we'll explore techniques to optimize your React applications.</p>

      <h3>Memoization with React.memo</h3>
      <p>Use React.memo to prevent unnecessary re-renders of functional components:</p>
      <pre><code>const MyComponent = React.memo(function MyComponent(props) {
  // Your component logic
});</code></pre>

      <h3>useMemo and useCallback Hooks</h3>
      <p>Use these hooks to memoize expensive calculations and callback functions:</p>
      <pre><code>const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b]);</code></pre>

      <h3>Code Splitting</h3>
      <p>Split your code into smaller chunks that can be loaded on demand:</p>
      <pre><code>const LazyComponent = React.lazy(() => import('./LazyComponent'));</code></pre>

      <h3>Virtualization for Long Lists</h3>
      <p>Use virtualization libraries like react-window or react-virtualized for rendering large lists efficiently.</p>

      <h3>Conclusion</h3>
      <p>By applying these optimization techniques, you can significantly improve the performance of your React applications, providing a better user experience.</p>
    `,
    author: "Ethan Yu",
    date: "05.03.2023",
    readTime: "7 Min",
    views: "1.2k",
    likes: "28",
    comments: "6",
    image: "/placeholder.svg?height=400&width=800",
    category: "React",
    trending: false,
    featured: false,
  },
  "css-grid-vs-flexbox": {
    id: 5,
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt:
      "A comprehensive guide to understanding the differences between CSS Grid and Flexbox and when to use each...",
    content: `
      <p>CSS Grid and Flexbox are two powerful layout systems in CSS, each with its own strengths. Understanding when to use each can help you create more efficient and maintainable layouts.</p>

      <h3>Flexbox: One-Dimensional Layouts</h3>
      <p>Flexbox is designed for one-dimensional layouts - either rows OR columns:</p>
      <ul>
        <li>Great for navigation bars</li>
        <li>Perfect for centering elements</li>
        <li>Excellent for distributing space among items</li>
        <li>Works well with varying-size content</li>
      </ul>

      <h3>CSS Grid: Two-Dimensional Layouts</h3>
      <p>CSS Grid is designed for two-dimensional layouts - rows AND columns:</p>
      <ul>
        <li>Perfect for page layouts</li>
        <li>Great for complex grid systems</li>
        <li>Excellent for overlapping elements</li>
        <li>Works well with defined layouts</li>
      </ul>

      <h3>When to Use Flexbox</h3>
      <p>Use Flexbox when:</p>
      <ul>
        <li>You need to align items in a single row or column</li>
        <li>You want content to dictate sizing</li>
        <li>You need simple alignment and distribution of space</li>
      </ul>

      <h3>When to Use Grid</h3>
      <p>Use Grid when:</p>
      <ul>
        <li>You need to create a layout with both rows and columns</li>
        <li>You want precise control over placement</li>
        <li>You need to overlap elements</li>
      </ul>

      <h3>Conclusion</h3>
      <p>Both Flexbox and Grid are valuable tools in a developer's toolkit. Often, the best approach is to use them together - Grid for the overall page layout and Flexbox for component-level alignment.</p>
    `,
    author: "Ethan Yu",
    date: "02.03.2023",
    readTime: "5 Min",
    views: "980",
    likes: "22",
    comments: "4",
    image: "/placeholder.svg?height=400&width=800",
    category: "CSS",
    trending: false,
    featured: false,
  },
  "typescript-best-practices": {
    id: 6,
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices for Large Applications",
    excerpt: "Essential TypeScript patterns and practices for building maintainable large-scale applications...",
    content: `
      <p>TypeScript has become the language of choice for many developers building large-scale applications. Here are some best practices to help you make the most of TypeScript in your projects.</p>

      <h3>Strict Type Checking</h3>
      <p>Enable strict mode in your tsconfig.json to catch more errors during compilation:</p>
      <pre><code>{
  "compilerOptions": {
    "strict": true
  }
}</code></pre>

      <h3>Use Interfaces for Object Shapes</h3>
      <p>Define clear interfaces for your data structures:</p>
      <pre><code>interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}</code></pre>

      <h3>Leverage Union Types and Type Guards</h3>
      <p>Use union types and type guards for flexible yet type-safe code:</p>
      <pre><code>type Result<T> = { success: true; data: T } | { success: false; error: string };

function handleResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}</code></pre>

      <h3>Organize Types in Separate Files</h3>
      <p>Keep your types organized in dedicated files to improve maintainability:</p>
      <pre><code>// types/user.ts
export interface User { ... }
export interface UserPreferences { ... }

// types/api.ts
export interface ApiResponse<T> { ... }</code></pre>

      <h3>Use Generics for Reusable Components</h3>
      <p>Leverage generics to create flexible, reusable components and functions:</p>
      <pre><code>function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(response => response.json());
}

// Usage
const users = await fetchData<User[]>('/api/users');</code></pre>

      <h3>Conclusion</h3>
      <p>By following these best practices, you can build more maintainable, robust TypeScript applications that scale well as your project grows.</p>
    `,
    author: "Ethan Yu",
    date: "28.02.2023",
    readTime: "9 Min",
    views: "1.7k",
    likes: "41",
    comments: "11",
    image: "/placeholder.svg?height=400&width=800",
    category: "TypeScript",
    trending: true,
    featured: false,
  },
}

// Featured post data
export const featuredPost: FeaturedPost = {
  slug: "what-does-it-take-to-become-a-web-developer",
  title: "What does it take to become a web developer?",
  excerpt:
    "Web development encompasses a variety of tasks and processes involved in creating websites for the internet. It involves various specialized fields, each with its own set of skills and techniques.",
  author: "Ethan Yu",
  date: "16.03.2023",
  readTime: "4 Min",
  views: "2.1k",
  likes: "45",
  comments: "12",
  image: "/placeholder.svg?height=400&width=600",
  category: "Career",
  featured: true,
}

// Blog categories
export const categories: Category[] = [
  { name: "All", count: 25, active: true },
  { name: "Career", count: 5, active: false },
  { name: "JavaScript", count: 8, active: false },
  { name: "React", count: 6, active: false },
  { name: "Backend", count: 4, active: false },
  { name: "CSS", count: 2, active: false },
]

// Blog stats
export const blogStats: Stat[] = [
  { label: "Total Posts", value: "25", icon: "MessageCircle" },
  { label: "Total Views", value: "15.2k", icon: "Eye" },
  { label: "Subscribers", value: "1.2k", icon: "User" },
  { label: "This Month", value: "3", icon: "Calendar" },
]

// Recent blog posts for homepage
export const recentBlogPosts = [
  {
    title: "What does it take to become a web developer?",
    excerpt: "Web development encompasses a variety of tasks and processes...",
    date: "16.03.2023",
    readTime: "4 Min",
    slug: "what-does-it-take-to-become-a-web-developer",
  },
  {
    title: "Modern JavaScript Frameworks Comparison",
    excerpt: "Exploring the differences between React, Vue, and Angular...",
    date: "12.03.2023",
    readTime: "6 Min",
    slug: "modern-javascript-frameworks-comparison",
  },
]
