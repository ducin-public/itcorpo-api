implement the `aggregate`/`$lookup` interfaces/methods/... that would get used in a new `aggregate` method in the ArrayCollection class. It should resemble what mongodb provides in `db.collection.aggregate({ $lookup : ... })` does.

original mongoDB $lookup api is an inspiration:
```ts
     $lookup: {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
// example:
      $lookup: {
         from: "items",
         localField: "item",    // field in the orders collection
         foreignField: "item",  // field in the items collection
         as: "fromItems"
      }
```

Let's take the following example as a reference.

Code BEFORE:
- need to load both `projects` and related `projectTeams` separately. This makes the code very verbose
```ts
const projectsPromise = dbConnection.projects.findMany();
const projectTeamsPromise = dbConnection.projectTeams.findMany();

let filteredProjects = filterProjects(req.query, {
    projects: await projectsPromise,
    projectTeams: await projectTeamsPromise,
});
```

Code AFTER:
```ts
const projectsWithProjectTeams = dbConnection.projects.aggregate(PARAMS)
let filteredProjects = filterProjects(req.query, projectsWithProjectTeams);
```

The data relations is this specific example:
- project schema has a `"id": "579ef28f-c539-41ff-abe2-e4f6b1c1afed"` property (serves as PRIMARY KEY)
- projectTeam schema has a `"projectId": "852b697f-1d11-4cfd-ab26-5aa2f926e79d",` property (serves as a FOREIGN KEY)
- project has a one-to-many relation with projectTeams (1 project - many projectTeam records)

This should work:
```ts
dbConnection.projects.aggregate([
    {
        $lookup: {
            from: "projectTeams",
            localField: "id",
            foreignField: "projectId",
            as: "projectTeams"
        }
    }
])
```

Acceptance criteria:
- `aggregate` method accepts an array. As for now, `$lookup` can be the only aggregate "stage" supported in `aggregate`, others wcn wait.
- **type-safety**. aggregate would heavily rely on typescript type parameters in order to create new types (often mapped types) according to what was passed. In above example the following type should be dynamically created:
```ts
type Project = {
    id: string;
    status: "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";
    name: string;
    description: string;
    startDate: string;
    budget: number;
    manager: number;
    endDate?: string | undefined;
}

type ProjectTeam = {
    employeeId: number;
    startDate: string;
    projectId: string;
    employeeName: string;
    projectName: string;
    engagementLevel: "FULL_TIME" | "PARTIAL_PLUS" | "HALF_TIME" | "ON_DEMAND";
    endDate?: string | undefined;
}

type __DYNAMIC__TYPE__RESULT__ = Project & {
    projectTeams: ProjectTeam[]
}
```


If there are any additional files that you might need to change, let me know.

As an example, please update the `// GET /projects/count` implementation in `resources/projects.router.ts` from the code-BEFORE style to using the new `aggregate` method
