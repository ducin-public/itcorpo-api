import { v4 as uuidv4 } from 'uuid';

import { ACTIVITY_TYPES, DbSchema, DBTimeEntry, DBTimesheetPeriod } from '../lib/db-schema';

const generateTimeEntry = (
    employeeId: number,
    projectId: string,
    date: string,
    description: string
): DBTimeEntry => {
    const activityType = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
    return {
        id: uuidv4(),
        employeeId,
        projectId,
        date,
        hours: Math.floor(Math.random() * 8) + 1, // 1-8 hours
        description,
        activityType,
        billable: activityType === "OTHER" ? Math.random() > 0.8 : true // OTHER: 20% chance billable, others always billable
    };
};

const generateTimesheetPeriod = (
    employeeId: number,
    startDate: string,
    endDate: string,
    entries: DBTimeEntry[]
): DBTimesheetPeriod => {
    const status = Math.random() > 0.3 ? "APPROVED" : 
                  Math.random() > 0.5 ? "SUBMITTED" : 
                  Math.random() > 0.7 ? "REJECTED" : 
                  "DRAFT";
    
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const billableHours = entries
        .filter(entry => entry.billable)
        .reduce((sum, entry) => sum + entry.hours, 0);

    const result: DBTimesheetPeriod = {
        id: uuidv4(),
        startDate,
        endDate,
        status,
        employeeId,
        totalHours,
        billableHours
    };

    if (status !== "DRAFT") {
        result.submittedAt = new Date(endDate).toISOString();
        
        if (status === "APPROVED" || status === "REJECTED") {
            const approvalDate = new Date(endDate);
            approvalDate.setDate(approvalDate.getDate() + 1);
            result.approvedAt = approvalDate.toISOString();
            result.approvedBy = Math.floor(Math.random() * 100) + 1; // Random manager ID
            
            if (status === "REJECTED") {
                result.comments = "Needs revision. Please update your time entries.";
            }
        }
    }

    return result;
};

export const generateTimesheets = (dbContent: DbSchema) => {
    const timeEntries: DBTimeEntry[] = [];
    const timesheetPeriods: DBTimesheetPeriod[] = [];

    // Generate entries for last 3 months
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);

    while (startDate <= today) {
        const currentDate = startDate.toISOString().split('T')[0];
        
        // For each employee with project involvement
        dbContent.projectTeams.forEach(pt => {
            if (Math.random() > 0.7) { // 30% chance of having entries for this day
                timeEntries.push(
                    generateTimeEntry(
                        pt.employeeId,
                        pt.projectId,
                        currentDate,
                        `Work on ${pt.projectName}`
                    )
                );
            }
        });

        startDate.setDate(startDate.getDate() + 1);
    }

    // Group entries by employee and month for timesheet periods
    const entriesByEmployee = new Map<number, DBTimeEntry[]>();
    timeEntries.forEach(entry => {
        const entries = entriesByEmployee.get(entry.employeeId) || [];
        entries.push(entry);
        entriesByEmployee.set(entry.employeeId, entries);
    });

    // Generate timesheet periods
    entriesByEmployee.forEach((entries, employeeId) => {
        // Group by month
        const entriesByMonth = entries.reduce((acc, entry) => {
            const monthKey = entry.date.substring(0, 7); // YYYY-MM
            const monthEntries = acc.get(monthKey) || [];
            monthEntries.push(entry);
            acc.set(monthKey, monthEntries);
            return acc;
        }, new Map<string, DBTimeEntry[]>());

        // Create period for each month
        entriesByMonth.forEach((monthEntries, monthKey) => {
            const [year, month] = monthKey.split('-').map(Number);
            const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];

            timesheetPeriods.push(
                generateTimesheetPeriod(employeeId, startDate, endDate, monthEntries)
            );
        });
    });

    return {
        timeEntries,
        timesheetPeriods
    };
};

