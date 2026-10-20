# Low-Budget Data Pipeline for a Non-Profit Education Client (Case Study)

A write-up of a data pipeline I built for a non-profit education client, using Google Apps Script, Google Sheets and Looker Studio. Client names, data and sheet names are removed. The code in this repo is generic and written fresh for this case study.

## The problem

The client tracked student attendance, academic assessments and social-emotional learning (SEL) data. Three constraints shaped every decision:

1. **Low budget.** No warehouse, no paid ETL tool. Everything had to run on free Google tools.
2. **High data volume.** Thousands of student records across many grades, growing every cycle, inside Google Sheets limits.
3. **Low technical awareness.** Program staff entered data by hand and did not trust numbers they could not explain. A pipeline nobody uses is worth nothing, so adoption was part of the problem.

## Architecture

```
Source sheets (entered by staff)
        |
        v
  Staging tables        raw copy, light cleaning, duplicate checks
        |
        v
 Intermediate tables    joins, business rules, status logic
        |
        v
   Final tables         6 reporting tables, one clear grain each
        |
        v
Looker Studio dashboards (extract data connector + pre-aggregation)
```

Supporting pieces:
- **Daily trigger** runs the full pipeline.
- **Watchdog** checks for a stuck run.
- **Chat alerts** tell staff when something fails, in plain language.
- **Manual run page** lets non-technical staff re-run the pipeline themselves.
- **Source audit** checks required columns before the run.

## Challenges and what I did

### 1. Low budget
I used Google Apps Script and Sheets instead of a paid stack. The cost was limits, which led to the next challenge.

### 2. High volume inside Sheets limits
- Wrote rows in batches of 2,000 with one trailing flush (see `batched_write.gs`).
- Deduplicated with an in-memory Set lookup instead of reading the sheet repeatedly.
- Used Looker Studio extracts with pre-aggregation, so dashboards stayed fast.
- Redesigned the final layer. The first version used one student-level table that was slow and hard to explain. I replaced it with six tables, each with a clear grain, and calculated expected row counts to check growth.

### 3. Low technical awareness and adoption
- Blocked duplicate student IDs at the point of entry (see `prevent_duplicate_ids.gs`), because bad entries were breaking reports.
- Added a manual run page and chat alerts so staff could see what the pipeline was doing.
- Wrote spreadsheet formulas that replicated the pipeline logic, so I could show dashboard values matched the source. This helped people trust the numbers.

## Trade-offs

- **One audit, not two gates.** I tied the source audit to the required-column checks that already gate the daily run. A second gate could have blocked reporting for small issues.
- **Slightly stale data for speed.** Dashboards use extracts, so they refresh on a schedule instead of live.
- **Simple over clever.** Sheets-based tools are easy for the client to understand and maintain, even though they are less scalable than a warehouse.

## Debugging lessons

- Several mismatches came from places I did not expect: a staging table that duplicated another, an upstream script that consolidated many per-grade sheets, and field names that differed across dashboards.
- Tracing every number back layer by layer was slower at first and faster overall.

## Workload

I delivered this alongside two other client projects, and all three were completed on time.

## Files

- `batched_write.gs`: batched, deduplicated ingestion
- `prevent_duplicate_ids.gs`: blocks repeated student IDs at entry

## Stack

Google Apps Script, Google Sheets, Looker Studio.
