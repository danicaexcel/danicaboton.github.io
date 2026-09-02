/* Zoho CRM recruitment reconstruction — V5
   Built from the user's surviving CRM screenshots and sanitized with synthetic data. */
function recruitmentV5() {
  const facilities = [
    {code:'FC-01',name:'North Harbor Care',state:'New York',openRoles:11,status:'Active'},
    {code:'FC-02',name:'Riverside Health',state:'New Jersey',openRoles:9,status:'Active'},
    {code:'FC-03',name:'Pinecrest Health',state:'Pennsylvania',openRoles:12,status:'Active'},
    {code:'FC-04',name:'Greenfield Care',state:'New York',openRoles:8,status:'Active'},
    {code:'FC-05',name:'Central Care Network',state:'New Jersey',openRoles:6,status:'Active'},
    {code:'FC-06',name:'Oak Meadow Care',state:'Pennsylvania',openRoles:5,status:'Active'},
    {code:'FC-07',name:'Valley Skilled Nursing',state:'New York',openRoles:7,status:'Active'},
    {code:'FC-08',name:'Brookview Health',state:'New Jersey',openRoles:4,status:'Active'},
    {code:'FC-09',name:'Cedar Grove Rehab',state:'Pennsylvania',openRoles:3,status:'Active'},
    {code:'FC-10',name:'Harbor Senior Living',state:'New York',openRoles:6,status:'Active'}
  ];

  const applicants = [
    {
      id:'A-10492', firstName:'Emily', lastName:'Carter', name:'Emily Carter', email:'emily.carter@example.test', phone:'+1 555 014 2198',
      license:'RN', licenseStatus:'Active', recentPosition:'Registered Nurse', employer:'North Harbor Medical', source:'Indeed', sourcingDate:'Aug 27, 2026 07:00 AM',
      stage:'Hired', hrStage:'Hired', result:'Qualified', tagging:'Priority Candidate', kanban:'Current Employee', badge:'Employee', score:92, fit:'Strong Fit',
      initialContacted:'Aug 27, 2026', lastContacted:'Aug 31, 2026', gdrive:'Candidate folder linked', resume:'Emily_Carter_Resume.pdf',
      jobOpening:'RN - North Harbor', department:'Nursing', positionApplied:'Registered Nurse', empType:'FT', facility:'North Harbor Care', expectedSalary:'$42.00/hr', salaryRange:'$40–$45/hr', recruiter:'Recruiter A', submissionStatus:'Submitted',
      shift:'7AM–3PM', tentativeStart:'Sep 14, 2026', availableDate:'Sep 8, 2026 09:00 AM', interviewSchedule:'Aug 31, 2026 10:00 AM', rate:'Hourly', blurb:'Emily_Carter_Profile.pdf', hiredDate:'Aug 31, 2026 04:23 PM',
      availability:'Tue–Thu · 9:00 AM–1:00 PM ET', offerRejection:'—', withdrawal:'—',
      logs:[
        {job:'JOB-000492',event:'Aug 28, 2026 07:18 PM',hired:'—',stage:'Submitted',recruiter:'Recruiter A',facility:'North Harbor Care',department:'Nursing',position:'Registered Nurse',empType:'FT'},
        {job:'JOB-000492',event:'Aug 30, 2026 02:10 PM',hired:'—',stage:'For Interview',recruiter:'Recruiter A',facility:'North Harbor Care',department:'Nursing',position:'Registered Nurse',empType:'FT'},
        {job:'JOB-000492',event:'Aug 31, 2026 04:23 PM',hired:'Aug 31, 2026 04:23 PM',stage:'Hired',recruiter:'Recruiter A',facility:'North Harbor Care',department:'Nursing',position:'Registered Nurse',empType:'FT'}
      ]
    },
    {id:'A-10491',firstName:'Calvin',lastName:'Brooks',name:'Calvin Brooks',email:'calvin.brooks@example.test',phone:'+1 555 018 4556',license:'RRT',licenseStatus:'Active',recentPosition:'Respiratory Therapist',employer:'Metro Respiratory Group',source:'Indeed',sourcingDate:'Aug 28, 2026 07:00 AM',stage:'For Screening',hrStage:'Recruiter Review',result:'Pending',tagging:'New Applicant',kanban:'New/Active',badge:'For Screening',score:84,fit:'Good Fit',initialContacted:'Aug 28, 2026',lastContacted:'Aug 30, 2026',gdrive:'Candidate folder linked',resume:'Calvin_Brooks_Resume.pdf',jobOpening:'RRT - Greenfield',department:'Respiratory Therapy',positionApplied:'Respiratory Therapist',empType:'FT',facility:'Greenfield Care',expectedSalary:'$38.00/hr',salaryRange:'$36–$40/hr',recruiter:'Recruiter B',submissionStatus:'Draft',shift:'7AM–3PM',tentativeStart:'—',availableDate:'Sep 4, 2026 10:00 AM',interviewSchedule:'—',rate:'Hourly',blurb:'—',hiredDate:'—',availability:'Wed–Fri · 10:00 AM–3:00 PM ET',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000488',event:'Aug 28, 2026 09:12 AM',hired:'—',stage:'New',recruiter:'Recruiter B',facility:'Greenfield Care',department:'Respiratory Therapy',position:'Respiratory Therapist',empType:'FT'},{job:'JOB-000488',event:'Aug 30, 2026 11:45 AM',hired:'—',stage:'For Screening',recruiter:'Recruiter B',facility:'Greenfield Care',department:'Respiratory Therapy',position:'Respiratory Therapist',empType:'FT'}]},
    {id:'A-10490',firstName:'Shivani',lastName:'Patel',name:'Shivani Patel',email:'shivani.patel@example.test',phone:'+1 555 016 2403',license:'CNA',licenseStatus:'Active',recentPosition:'Certified Nursing Assistant',employer:'Greenfield Care',source:'Apploi',sourcingDate:'Aug 27, 2026 07:00 AM',stage:'For Interview',hrStage:'Interview',result:'Qualified',tagging:'Priority Candidate',kanban:'New/Active',badge:'For Screening',score:90,fit:'Strong Fit',initialContacted:'Aug 27, 2026',lastContacted:'Aug 31, 2026',gdrive:'Candidate folder linked',resume:'Shivani_Patel_Resume.pdf',jobOpening:'CNA - Riverside',department:'Nursing',positionApplied:'Certified Nursing Assistant',empType:'FT',facility:'Riverside Health',expectedSalary:'$24.00/hr',salaryRange:'$22–$26/hr',recruiter:'Recruiter C',submissionStatus:'Submitted',shift:'3PM–11PM',tentativeStart:'Sep 12, 2026',availableDate:'Sep 2, 2026 08:00 AM',interviewSchedule:'Sep 2, 2026 02:30 PM',rate:'Hourly',blurb:'Shivani_Patel_Profile.pdf',hiredDate:'—',availability:'Mon–Wed · 8:00 AM–12:00 PM ET',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000481',event:'Aug 27, 2026 03:14 PM',hired:'—',stage:'Submitted',recruiter:'Recruiter C',facility:'Riverside Health',department:'Nursing',position:'Certified Nursing Assistant',empType:'FT'},{job:'JOB-000481',event:'Aug 31, 2026 08:22 AM',hired:'—',stage:'For Interview',recruiter:'Recruiter C',facility:'Riverside Health',department:'Nursing',position:'Certified Nursing Assistant',empType:'FT'}]},
    {id:'A-10489',firstName:'Hannah',lastName:'Irving',name:'Hannah Irving',email:'hannah.irving@example.test',phone:'+1 555 013 5346',license:'—',licenseStatus:'—',recentPosition:'Assistant Food Service Director',employer:'Harbor Senior Living',source:'Indeed',sourcingDate:'Aug 25, 2026 07:00 AM',stage:'Inactive',hrStage:'Closed',result:'Not Qualified',tagging:'Standard',kanban:'Inactive',badge:'Not Qualified',score:71,fit:'Review',initialContacted:'Aug 25, 2026',lastContacted:'Aug 27, 2026',gdrive:'Candidate folder linked',resume:'Hannah_Irving_Resume.pdf',jobOpening:'Food Service Director - Harbor',department:'Dining Services',positionApplied:'Assistant Food Service Director',empType:'FT',facility:'Harbor Senior Living',expectedSalary:'$58,000',salaryRange:'$55k–$62k',recruiter:'Recruiter A',submissionStatus:'Draft',shift:'Day',tentativeStart:'—',availableDate:'Flexible',interviewSchedule:'—',rate:'Annual',blurb:'—',hiredDate:'—',availability:'Flexible',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000477',event:'Aug 25, 2026 02:02 PM',hired:'—',stage:'New',recruiter:'Recruiter A',facility:'Harbor Senior Living',department:'Dining Services',position:'Assistant Food Service Director',empType:'FT'},{job:'JOB-000477',event:'Aug 27, 2026 01:19 PM',hired:'—',stage:'Inactive',recruiter:'Recruiter A',facility:'Harbor Senior Living',department:'Dining Services',position:'Assistant Food Service Director',empType:'FT'}]},
    {id:'A-10488',firstName:'Francis',lastName:'Torres',name:'Francis Torres',email:'francis.torres@example.test',phone:'+1 555 017 3154',license:'RN',licenseStatus:'Active',recentPosition:'RN Supervisor Weekend',employer:'Brookview Health',source:'Indeed',sourcingDate:'Aug 26, 2026 07:00 AM',stage:'Offered',hrStage:'Offer',result:'Qualified',tagging:'Priority Candidate',kanban:'New/Active',badge:'For Screening',score:88,fit:'Strong Fit',initialContacted:'Aug 26, 2026',lastContacted:'Aug 31, 2026',gdrive:'Candidate folder linked',resume:'Francis_Torres_Resume.pdf',jobOpening:'RN Supervisor - Brookview',department:'Nursing',positionApplied:'RN Supervisor Weekend',empType:'FT',facility:'Brookview Health',expectedSalary:'$48.00/hr',salaryRange:'$45–$50/hr',recruiter:'Recruiter D',submissionStatus:'Submitted',shift:'Weekend',tentativeStart:'Sep 15, 2026',availableDate:'Weekend',interviewSchedule:'Aug 30, 2026 11:00 AM',rate:'Hourly',blurb:'Francis_Torres_Profile.pdf',hiredDate:'—',availability:'Weekend',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000470',event:'Aug 26, 2026 08:45 AM',hired:'—',stage:'Submitted',recruiter:'Recruiter D',facility:'Brookview Health',department:'Nursing',position:'RN Supervisor Weekend',empType:'FT'},{job:'JOB-000470',event:'Aug 31, 2026 09:05 AM',hired:'—',stage:'Offered',recruiter:'Recruiter D',facility:'Brookview Health',department:'Nursing',position:'RN Supervisor Weekend',empType:'FT'}]},
    {id:'A-10487',firstName:'Letoria',lastName:'Bush',name:'Letoria Bush',email:'letoria.bush@example.test',phone:'+1 555 015 5056',license:'—',licenseStatus:'—',recentPosition:'Unit Clerk',employer:'Central Care Network',source:'ZipRecruiter',sourcingDate:'Aug 23, 2026 07:00 AM',stage:'Retap',hrStage:'Retap',result:'Pending',tagging:'Retap',kanban:'Retap',badge:'Viewed',score:81,fit:'Good Fit',initialContacted:'Aug 23, 2026',lastContacted:'Aug 29, 2026',gdrive:'Candidate folder linked',resume:'Letoria_Bush_Resume.pdf',jobOpening:'Unit Clerk - Central',department:'Administration',positionApplied:'Unit Clerk',empType:'FT',facility:'Central Care Network',expectedSalary:'$22.00/hr',salaryRange:'$20–$24/hr',recruiter:'Recruiter B',submissionStatus:'Draft',shift:'Day',tentativeStart:'—',availableDate:'Sep 5, 2026',interviewSchedule:'—',rate:'Hourly',blurb:'—',hiredDate:'—',availability:'Tue–Fri',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000466',event:'Aug 23, 2026 08:22 AM',hired:'—',stage:'New',recruiter:'Recruiter B',facility:'Central Care Network',department:'Administration',position:'Unit Clerk',empType:'FT'},{job:'JOB-000466',event:'Aug 29, 2026 03:30 PM',hired:'—',stage:'Retap',recruiter:'Recruiter B',facility:'Central Care Network',department:'Administration',position:'Unit Clerk',empType:'FT'}]},
    {id:'A-10486',firstName:'Karla',lastName:'Osorio',name:'Karla Osorio',email:'karla.osorio@example.test',phone:'+1 555 012 9931',license:'LPN',licenseStatus:'Active',recentPosition:'Licensed Practical Nurse',employer:'Cedar Grove Rehab',source:'LinkedIn',sourcingDate:'Aug 21, 2026 07:00 AM',stage:'Inactive',hrStage:'Closed',result:'Not Qualified',tagging:'Standard',kanban:'Inactive',badge:'Not Qualified',score:68,fit:'Review',initialContacted:'Aug 21, 2026',lastContacted:'Aug 25, 2026',gdrive:'Candidate folder linked',resume:'Karla_Osorio_Resume.pdf',jobOpening:'LPN - Cedar Grove',department:'Nursing',positionApplied:'Licensed Practical Nurse',empType:'FT',facility:'Cedar Grove Rehab',expectedSalary:'$31.00/hr',salaryRange:'$29–$33/hr',recruiter:'Recruiter A',submissionStatus:'Draft',shift:'7AM–3PM',tentativeStart:'—',availableDate:'Mon–Fri',interviewSchedule:'—',rate:'Hourly',blurb:'—',hiredDate:'—',availability:'Mon–Fri',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000459',event:'Aug 21, 2026 11:10 AM',hired:'—',stage:'New',recruiter:'Recruiter A',facility:'Cedar Grove Rehab',department:'Nursing',position:'Licensed Practical Nurse',empType:'FT'},{job:'JOB-000459',event:'Aug 25, 2026 01:44 PM',hired:'—',stage:'Inactive',recruiter:'Recruiter A',facility:'Cedar Grove Rehab',department:'Nursing',position:'Licensed Practical Nurse',empType:'FT'}]},
    {id:'A-10485',firstName:'Kadira',lastName:'Reed',name:'Kadira Reed',email:'kadira.reed@example.test',phone:'+1 555 012 7721',license:'CNA',licenseStatus:'Active',recentPosition:'Certified Nursing Assistant',employer:'Valley Skilled Nursing',source:'Indeed',sourcingDate:'Aug 30, 2026 07:00 AM',stage:'New',hrStage:'New Applicant',result:'Pending',tagging:'New Applicant',kanban:'Inactive',badge:'New',score:76,fit:'Good Fit',initialContacted:'—',lastContacted:'—',gdrive:'Candidate folder linked',resume:'Kadira_Reed_Resume.pdf',jobOpening:'CNA - Valley',department:'Nursing',positionApplied:'Certified Nursing Assistant',empType:'PT',facility:'Valley Skilled Nursing',expectedSalary:'$23.00/hr',salaryRange:'$21–$25/hr',recruiter:'Recruiter C',submissionStatus:'Draft',shift:'Evening',tentativeStart:'—',availableDate:'Flexible',interviewSchedule:'—',rate:'Hourly',blurb:'—',hiredDate:'—',availability:'Flexible',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000455',event:'Aug 30, 2026 10:14 AM',hired:'—',stage:'New',recruiter:'Recruiter C',facility:'Valley Skilled Nursing',department:'Nursing',position:'Certified Nursing Assistant',empType:'PT'}]},
    {id:'A-10484',firstName:'Marissa',lastName:'Accurso',name:'Marissa Accurso',email:'marissa.accurso@example.test',phone:'+1 555 018 3488',license:'RN',licenseStatus:'Active',recentPosition:'Registered Nurse',employer:'Riverside Health',source:'Indeed',sourcingDate:'Aug 20, 2026 07:00 AM',stage:'Inactive',hrStage:'Closed',result:'Not Qualified',tagging:'Standard',kanban:'Inactive',badge:'Not Qualified',score:64,fit:'Review',initialContacted:'Aug 20, 2026',lastContacted:'Aug 22, 2026',gdrive:'Candidate folder linked',resume:'Marissa_Accurso_Resume.pdf',jobOpening:'RN - Riverside',department:'Nursing',positionApplied:'Registered Nurse',empType:'FT',facility:'Riverside Health',expectedSalary:'$41.00/hr',salaryRange:'$39–$44/hr',recruiter:'Recruiter D',submissionStatus:'Draft',shift:'Night',tentativeStart:'—',availableDate:'Tue–Thu',interviewSchedule:'—',rate:'Hourly',blurb:'—',hiredDate:'—',availability:'Tue–Thu',offerRejection:'—',withdrawal:'—',logs:[{job:'JOB-000448',event:'Aug 20, 2026 09:34 AM',hired:'—',stage:'New',recruiter:'Recruiter D',facility:'Riverside Health',department:'Nursing',position:'Registered Nurse',empType:'FT'},{job:'JOB-000448',event:'Aug 22, 2026 04:18 PM',hired:'—',stage:'Inactive',recruiter:'Recruiter D',facility:'Riverside Health',department:'Nursing',position:'Registered Nurse',empType:'FT'}]}
  ];

  const employees = [
    {id:'EMP-0214',name:'Emily Carter',email:'emily.carter@example.test',phone:'+1 555 014 2198',facility:'North Harbor Care',type:'FT',status:'A',source:'Indeed',department:'Nursing',position:'Registered Nurse'},
    {id:'EMP-0213',name:'Aayana Cuffie',email:'aayana.cuffie@example.test',phone:'+1 555 012 6717',facility:'Greenfield Care',type:'FT',status:'A',source:'Indeed',department:'Nursing',position:'Licensed Practical Nurse'},
    {id:'EMP-0212',name:'Ashley Bell',email:'ashley.bell@example.test',phone:'+1 555 019 0226',facility:'Riverside Health',type:'PT',status:'A',source:'Indeed',department:'Nursing',position:'CNA'},
    {id:'EMP-0211',name:'Celeste Peterson',email:'celeste.peterson@example.test',phone:'+1 555 013 1028',facility:'Central Care Network',type:'FT',status:'A',source:'Indeed',department:'Administration',position:'Unit Clerk'},
    {id:'EMP-0210',name:'JayLinaa Arcee',email:'jaylinaa.arcee@example.test',phone:'+1 555 017 1423',facility:'Harbor Senior Living',type:'FT',status:'A',source:'Career Page',department:'Dining Services',position:'Dietary Aide'},
    {id:'EMP-0209',name:'Elisiana Monk-Lopez',email:'elisiana.lopez@example.test',phone:'+1 555 018 9699',facility:'Greenfield Care',type:'FT',status:'A',source:'Indeed',department:'Respiratory Therapy',position:'Respiratory Therapist'},
    {id:'EMP-0208',name:'Criseana Christian',email:'criseana.christian@example.test',phone:'+1 555 013 8794',facility:'Brookview Health',type:'FT',status:'A',source:'Indeed',department:'Nursing',position:'RN Supervisor'},
    {id:'EMP-0207',name:'Marlaina Deshields',email:'marlaina.deshields@example.test',phone:'+1 555 019 4233',facility:'Pinecrest Health',type:'FT',status:'A',source:'Indeed',department:'Nursing',position:'MDS Coordinator'}
  ];

  const jobs = [
    {id:'JOB-741',title:'CNA - North Harbor',facility:'North Harbor Care',group:'High Priority',visibility:'Confidential',openings:9,status:'Open'},
    {id:'JOB-740',title:'CNA - Riverside',facility:'Riverside Health',group:'Urgent',visibility:'Public',openings:8,status:'Open'},
    {id:'JOB-739',title:'LPN - Pinecrest',facility:'Pinecrest Health',group:'High Priority',visibility:'Public',openings:5,status:'Open'},
    {id:'JOB-738',title:'Respiratory Therapist',facility:'Greenfield Care',group:'Urgent',visibility:'Public',openings:9,status:'Open'},
    {id:'JOB-737',title:'Unit Clerk',facility:'Central Care Network',group:'Open',visibility:'Public',openings:2,status:'Open'},
    {id:'JOB-736',title:'Dietary Aide',facility:'Oak Meadow Care',group:'Closed',visibility:'Public',openings:0,status:'Closed'},
    {id:'JOB-735',title:'RN Supervisor',facility:'Valley Skilled Nursing',group:'Critical',visibility:'Confidential',openings:3,status:'Open'}
  ];

  const activityReportRecords = [
    {
      id:'RAR-2026-W35', name:'Weekly Recruitment Activity — W35 2026', owner:'CRM Reporting', email:'recruiting-ops@example.test', secondaryEmail:'', periodType:'Weekly', reportDay:'Aug 30, 2026', reportMonth:'August 2026', periodLabel:'Aug 24–30, 2026', totalActivities:42, periodStart:'Aug 24, 2026', periodEnd:'Aug 30, 2026', activityType:'All Recruitment Activity', weekNumber:'35', reportYear:'2026',
      rows:[
        ['Applied','Emily Carter','+1 555 014 2198','emily.carter@example.test','North Harbor Care','RN'],
        ['Sourced','Calvin Brooks','+1 555 018 4556','calvin.brooks@example.test','Greenfield Care','RRT'],
        ['Contacted','Shivani Patel','+1 555 016 2403','shivani.patel@example.test','Riverside Health','CNA'],
        ['Interview Scheduled','Emily Carter','+1 555 014 2198','emily.carter@example.test','North Harbor Care','RN'],
        ['Applied','Kadira Reed','+1 555 012 7721','kadira.reed@example.test','Valley Skilled Nursing','CNA'],
        ['Sourced','Francis Torres','+1 555 017 3154','francis.torres@example.test','Brookview Health','RN Supervisor'],
        ['Contacted','Letoria Bush','+1 555 015 5056','letoria.bush@example.test','Central Care Network','Unit Clerk']
      ]
    },
    {id:'RAR-2026-W34',name:'Weekly Recruitment Activity — W34 2026',owner:'CRM Reporting',email:'recruiting-ops@example.test',secondaryEmail:'',periodType:'Weekly',reportDay:'Aug 23, 2026',reportMonth:'August 2026',periodLabel:'Aug 17–23, 2026',totalActivities:38,periodStart:'Aug 17, 2026',periodEnd:'Aug 23, 2026',activityType:'All Recruitment Activity',weekNumber:'34',reportYear:'2026',rows:[['Applied','Jordan Lee','+1 555 013 4491','jordan.lee@example.test','Pinecrest Health','LPN'],['Contacted','Sofia Reyes','+1 555 011 9021','sofia.reyes@example.test','Greenfield Care','RRT'],['Interview Scheduled','Avery Morgan','+1 555 016 8821','avery.morgan@example.test','North Harbor Care','RN']]},
    {id:'RAR-2026-M08',name:'Monthly Recruitment Activity — August 2026',owner:'CRM Reporting',email:'recruiting-ops@example.test',secondaryEmail:'',periodType:'Monthly',reportDay:'Aug 31, 2026',reportMonth:'August 2026',periodLabel:'August 2026',totalActivities:186,periodStart:'Aug 1, 2026',periodEnd:'Aug 31, 2026',activityType:'All Recruitment Activity',weekNumber:'—',reportYear:'2026',rows:[['Applied','Monthly aggregate','—','—','All Facilities','All Positions'],['Sourced','Monthly aggregate','—','—','All Facilities','All Positions'],['Contacted','Monthly aggregate','—','—','All Facilities','All Positions'],['Interview Scheduled','Monthly aggregate','—','—','All Facilities','All Positions']]}
  ];

  const reportCenterRecords = [
    {
      id:'RPT-001', name:'Recruitment Activity — August 2026', reportType:'Recruitment Activity', owner:'CRM Reporting', periodType:'Monthly', periodStart:'Aug 1, 2026', periodEnd:'Aug 31, 2026', periodLabel:'August 2026', generated:'Aug 31, 2026 06:00 AM', totalRows:6,
      columns:['Facility','Position','Submitted','Interviews','NCNS','Withdrawn','HM Rejected','Offers Rejected','Offers Accepted','Hired','Running / YTD'],
      rows:[
        ['North Harbor Care','RN','35','25','3','4','5','2','8','6','35 / 25 / 6'],
        ['North Harbor Care','CNA','28','18','2','3','4','1','6','4','28 / 18 / 4'],
        ['Riverside Health','RN','42','30','4','6','7','3','9','5','42 / 30 / 5'],
        ['Riverside Health','LPN','31','20','2','4','3','2','7','5','31 / 20 / 5'],
        ['Pinecrest Health','CNA','39','27','3','5','5','2','8','6','39 / 27 / 6'],
        ['Greenfield Care','RRT','22','16','1','2','2','1','5','4','22 / 16 / 4']
      ]
    },
    {
      id:'RPT-002', name:'Why Candidates Are Lost — August 2026', reportType:'Candidate Loss Analysis', owner:'CRM Reporting', periodType:'Monthly', periodStart:'Aug 1, 2026', periodEnd:'Aug 31, 2026', periodLabel:'August 2026', generated:'Aug 31, 2026 06:05 AM', totalRows:6,
      columns:['Facility','Position','Total Lost','Pay Rate','Benefits','Schedule','Distance','Different Job','Process Delay','No Longer Interested','Other'],
      rows:[
        ['North Harbor Care','RN','18','3','1','2','1','5','3','2','1'],
        ['North Harbor Care','CNA','13','2','1','1','1','4','2','1','1'],
        ['Riverside Health','RN','20','4','2','2','1','5','3','2','1'],
        ['Riverside Health','LPN','12','2','1','2','1','2','2','1','1'],
        ['Pinecrest Health','CNA','15','3','1','2','1','3','2','2','1'],
        ['Greenfield Care','RRT','8','1','1','1','0','2','1','1','1']
      ]
    },
    {
      id:'RPT-003', name:'Job Opening History — YTD 2026', reportType:'Job Opening History', owner:'CRM Reporting', periodType:'YTD', periodStart:'Jan 1, 2026', periodEnd:'Aug 31, 2026', periodLabel:'2026 YTD', generated:'Aug 31, 2026 06:10 AM', totalRows:6,
      columns:['Facility','Position','Original Open','Closed','Reopened','Times Reopened','Current Open Date','Status','Current Days Open'],
      rows:[
        ['North Harbor Care','RN','Jan 5, 2026','Mar 15 / May 20','Apr 10 / Jun 1','2','Jun 1, 2026','Open','91'],
        ['North Harbor Care','CNA','Feb 1, 2026','—','—','0','Feb 1, 2026','Open','211'],
        ['Riverside Health','RN','May 18, 2026','—','—','0','May 18, 2026','Open','105'],
        ['Pinecrest Health','CNA','Jul 1, 2026','—','—','0','Jul 1, 2026','Open','61'],
        ['Greenfield Care','RRT','May 20, 2026','—','—','0','May 20, 2026','Open','103'],
        ['Oak Meadow Care','Dietary Aide','Mar 14, 2026','Aug 20, 2026','—','0','—','Closed','0']
      ]
    },
    {
      id:'RPT-004', name:'Applicant & Sourcing — Week 35 2026', reportType:'Applicant & Sourcing', owner:'CRM Reporting', periodType:'Weekly', periodStart:'Aug 24, 2026', periodEnd:'Aug 30, 2026', periodLabel:'Week 35 · Aug 24–30, 2026', generated:'Aug 31, 2026 06:15 AM', totalRows:6,
      columns:['Facility','Position','Week','Applied','Sourced','Contacted','Interview Scheduled','Running Applied','Running Sourced','Running Contacted','Running Interviews'],
      rows:[
        ['North Harbor Care','RN','Week 35','15','8','10','6','45','25','31','18'],
        ['North Harbor Care','CNA','Week 35','11','6','8','5','36','21','26','16'],
        ['Riverside Health','RN','Week 35','13','7','9','5','41','23','29','17'],
        ['Riverside Health','LPN','Week 35','9','5','6','4','30','17','20','12'],
        ['Pinecrest Health','CNA','Week 35','12','7','9','5','39','22','28','16'],
        ['Greenfield Care','RRT','Week 35','8','4','6','3','24','13','18','10']
      ]
    }
  ];

  const state = {module:'Applicants', applicantView:'kanban', employeeView:'tiles', jobView:'kanban', filter:'All', sort:'none'};
  const moduleNames=['Applicants','Employees','Job Openings','Facilities','Tasks','Meetings','Calls','Recruitment Report Center','Recruiter Activity Reports','Services','Projects'];

  const topIcon=(name)=>{
    const icons={
      menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h13M4 12h16M4 17h10"/><path d="m16 15 3 2-3 2"/></svg>',
      link:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.4 13.6 8.7 15.3a4 4 0 0 1-5.7-5.7l2.6-2.6a4 4 0 0 1 5.7 0"/><path d="m13.6 10.4 1.7-1.7a4 4 0 0 1 5.7 5.7L18.4 17a4 4 0 0 1-5.7 0"/><path d="m8.5 12 7 0"/></svg>',
      search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.8"/><path d="m15.2 15.2 4.4 4.4"/></svg>',
      plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
      task:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="15" height="15" rx="2"/><path d="m8 11 2.2 2.2L15.5 8"/><path d="M15 4v3h3"/></svg>',
      calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7.5 3v5M16.5 3v5M3.5 9.5h17M8 13h1M12 13h1M16 13h1M8 17h1M12 17h1M16 17h1"/></svg>',
      store:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16l-1.5-5h-13z"/><path d="M5 9v10h14V9M8 19v-5h8v5"/><path d="M4 9c0 1.5 1 2.5 2.5 2.5S9 10.5 9 9c0 1.5 1 2.5 3 2.5S15 10.5 15 9c0 1.5 1 2.5 2.5 2.5S20 10.5 20 9"/></svg>',
      bell:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 17h11l-1.2-1.7V10a4.3 4.3 0 0 0-8.6 0v5.3z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
      gear:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1l.4 3.1h5l.4-3.1a8 8 0 0 0 1.7-1l2.4 1 2-3.4L19 13a7 7 0 0 0 .1-1Z"/></svg>'
    };
    return icons[name]||'';
  };
  root.innerHTML=`
    <div class="z5-shell">
      <header class="z5-topbar">
        <button class="z5-menu" aria-label="Main menu">${topIcon('menu')}</button>
        <nav class="z5-topnav">${['Home','Workqueue','Modules','Reports','Analytics','Agents'].map(x=>`<button data-z5-top="${x}" class="${x==='Home'?'active':''}">${x}</button>`).join('')}</nav>
        <div class="z5-toptools">
          <button class="z5-product" title="Zoho CRM">${topIcon('link')}<span>Zoho CRM</span><b>⌄</b></button>
          <button class="z5-icon" title="Search">${topIcon('search')}</button>
          <button class="z5-zia" title="Zia"><span>Zia</span><i>✦</i></button>
          <button class="z5-icon" title="Create">${topIcon('plus')}</button>
          <button class="z5-icon" title="Activities">${topIcon('task')}</button>
          <button class="z5-icon" title="Calendar">${topIcon('calendar')}</button>
          <button class="z5-icon" title="Marketplace">${topIcon('store')}</button>
          <button class="z5-icon z5-bell" title="Notifications">${topIcon('bell')}<em>5</em></button>
          <button class="z5-icon" title="Settings">${topIcon('gear')}</button>
          <span class="z5-user" title="Demo user">DB</span>
        </div>
      </header>
      <div class="z5-body">
        <aside class="z5-side">
          <div class="z5-app"><span class="z5-rm">RM</span><strong>Recruitment M...</strong><span>▾</span><button>•••</button></div>
          <label class="z5-search"><span>⌕</span><input placeholder="Search"></label>
          <div class="z5-modules">${moduleNames.map((x,i)=>`<button data-z5-module="${x}" class=""><span>${['◎','◉','▤','⌂','☑','▦','☎','▥','▧','⌘','◆'][i]}</span>${x}</button>`).join('')}</div>
          <div class="z5-sidefoot"><span>My Pins</span><span>Chats</span><span>Contacts</span></div>
        </aside>
        <main class="z5-main" id="z5Main"></main>
      </div>
    </div>`;

  const main=document.getElementById('z5Main');
  const moduleButtons=[...document.querySelectorAll('[data-z5-module]')];
  function setTopActive(tab){document.querySelectorAll('[data-z5-top]').forEach(x=>x.classList.toggle('active',x.dataset.z5Top===tab))}
  function setModule(name){state.module=name;moduleButtons.forEach(b=>b.classList.toggle('active',b.dataset.z5Module===name));setTopActive('Modules');renderModule()}
  function moduleHead(title,tabs=[`All ${title}`]){return `<div class="z5-module-title"><h1>${title}</h1></div><div class="z5-view-tabs">${tabs.map((t,i)=>`<button class="${i===0?'active':''}">${t}</button>`).join('')}<button>•••</button></div>`}
  function toolbar({create='',views='',extra=''}){return `<div class="z5-toolbar"><div><button>⌕ Filter</button><button>⇅ Sort</button><i></i><button>☷</button>${views}<button>▦</button><button>◷</button><button>⌞</button>${extra}</div><div>${create?`<button class="z5-primary" data-z5-create>${create}<span>▾</span></button>`:''}<button class="z5-outline">•••</button></div></div>`}
  function field(label,value,cls=''){return `<div class="z5-field ${cls}"><span>${label}</span><strong>${value||'—'}</strong></div>`}
  function stageClass(x=''){const s=x.toLowerCase();return s.includes('screen')?'orange':s.includes('new')?'pink':s.includes('view')?'blue':s.includes('employee')||s.includes('hired')?'green':s.includes('inactive')||s.includes('not qualified')?'neutral':'orange'}

  function renderApplicants(){
    let data=[...applicants]; if(state.filter!=='All')data=data.filter(a=>a.source===state.filter); if(state.sort==='score')data.sort((a,b)=>b.score-a.score); if(state.sort==='name')data.sort((a,b)=>a.name.localeCompare(b.name));
    const views=`<button data-z5-appview="kanban" class="${state.applicantView==='kanban'?'selected':''}" title="Kanban View">▥</button><button data-z5-appview="tiles" class="${state.applicantView==='tiles'?'selected':''}" title="Tile View">▦</button>`;
    main.innerHTML=`${moduleHead('Applicants',['All Applicants','Basecamp View','All Locked Applicants'])}${toolbar({create:'Create Applicant',views})}${state.applicantView==='kanban'?applicantKanban(data):applicantTiles(data)}`;
    document.querySelectorAll('[data-z5-appview]').forEach(b=>b.onclick=()=>{state.applicantView=b.dataset.z5Appview;renderApplicants()});
    document.querySelectorAll('[data-z5-applicant]').forEach(b=>b.onclick=()=>openApplicant(b.dataset.z5Applicant));
    const create=document.querySelector('[data-z5-create]');if(create)create.onclick=openCreateApplicant;
  }

  function applicantKanban(data){
    const groups=[['Inactive','inactive',49597],['Current Employee','employee',0],['New/Active','active',6200],['Retap','retap',0],['NCNS.','ncns',0]];
    return `<div class="z5-kanban-tools"><button>Recruitment Stage ▾</button><span></span><label>Layouts <button>Recruitment Layout ▾</button></label></div><div class="z5-kanban-scroll"><div class="z5-kanban">${groups.map(([name,cls,count])=>`<section class="z5-kcol"><header class="${cls}"><b>${name}</b><small>${count}</small><strong>0</strong></header><div class="z5-kbody">${data.filter(a=>a.kanban===name.replace('.','')).map(a=>`<article data-z5-applicant="${a.id}"><b>${a.name}</b><span>${a.email}</span><span>${a.phone} ☎</span><em class="${stageClass(a.badge)}">${a.badge}</em><small>${a.source}</small></article>`).join('')||'<div class="z5-empty">No Applicants found.</div>'}</div></section>`).join('')}<section class="z5-kcol slim"><header class="hired"><b>Hired</b><small>0</small><strong>0</strong></header><div class="z5-kbody"><div class="z5-empty">No Applicants found.</div></div></section></div></div>`;
  }

  function applicantTiles(data){return `<div class="z5-subbar"><label><input type="checkbox"> Select All</label><button>Applicants - Tile View ▾</button><span></span><label>Records Per Page <button>100 ▾</button></label><label>Filter By <button>All ▾</button></label></div><div class="z5-tilearea"><div class="z5-cards">${data.slice(0,9).map(a=>`<article class="z5-card" data-z5-applicant="${a.id}"><div class="z5-cardhead"><span class="z5-avatar">${a.name[0]}</span><div><b>${a.name}</b><small>Applicant Name</small></div></div><dl><dt>License</dt><dd>${a.license}</dd><dt>Recent Job Position</dt><dd><strong>${a.recentPosition}</strong></dd><dt>Employer (Most Recent)</dt><dd>${a.employer}</dd><dt>Applicant Email</dt><dd class="link">${a.email}</dd><dt>Applicant Phone</dt><dd class="phone">${a.phone} ☎</dd><dt>Source</dt><dd><strong>${a.source}</strong></dd></dl></article>`).join('')}</div></div><div class="z5-footer"><span>Total Records&nbsp; <b>55,841</b></span><span>‹ &nbsp; 1 to 100 &nbsp; ›</span></div>`}

  function renderEmployees(){
    const views=`<button data-z5-empview="table" class="${state.employeeView==='table'?'selected':''}" title="Table View">☷</button><button data-z5-empview="tiles" class="${state.employeeView==='tiles'?'selected':''}" title="Tile View">▦</button>`;
    main.innerHTML=`${moduleHead('Employees',['All Employees'])}${toolbar({create:'Create Employee',views})}<div class="z5-subbar"><label><input type="checkbox"> Select All</label><button>Employees - ${state.employeeView==='tiles'?'Tile':'Table'} View ▾</button><span></span><label>Records Per Page <button>100 ▾</button></label><label>Filter By <button>All ▾</button></label></div>${state.employeeView==='tiles'?employeeTiles():employeeTable()}<div class="z5-footer"><span>Total Records&nbsp; <b>33</b></span><span>‹ &nbsp; 1 to 33 &nbsp; ›</span></div>`;
    document.querySelectorAll('[data-z5-empview]').forEach(b=>b.onclick=()=>{state.employeeView=b.dataset.z5Empview;renderEmployees()});
    document.querySelectorAll('[data-z5-employee]').forEach(row=>row.onclick=()=>openEmployee(row.dataset.z5Employee));
  }
  function employeeTiles(){return `<div class="z5-tilearea"><div class="z5-cards employee">${employees.map(e=>`<article class="z5-card employee" data-z5-employee="${e.id}"><div class="z5-cardhead"><span class="z5-avatar">${e.name[0]}</span><div><b>${e.name}</b><small>Employee Name</small></div></div><div class="z5-contact"><span>✉ <b>${e.email}</b></span><span>▯ ${e.phone} ☎</span></div><dl><dt>Current Facility</dt><dd><strong>${e.facility}</strong></dd><dt>Employment Type</dt><dd><strong>${e.type}</strong></dd><dt>Employee Status</dt><dd><strong>${e.status}</strong></dd><dt>Applicant Source</dt><dd>${e.source}</dd><dt>Department</dt><dd>${e.department}</dd></dl></article>`).join('')}</div></div>`}
  function employeeTable(){return tableView(['Employee Name','Position','Email','Phone','Current Facility','Employment Type','Status','Applicant Source','Department'],employees.map(e=>[e.name,e.position,e.email,e.phone,e.facility,e.type,e.status,e.source,e.department]),{linkFirst:true,rowAttr:i=>`data-z5-employee="${employees[i].id}"`})}

  function openEmployee(id){
    const e=employees.find(x=>x.id===id)||employees[0];
    const hireDate=id==='EMP-0214'?'Aug 28, 2026':'Aug 24, 2026';
    const recruiter=['Recruiter A','Recruiter B','Recruiter C'][Math.abs(employees.indexOf(e))%3];
    const related=['Notes','Connected Records','Attachments','Cadences','Open Activities','Closed Activities','Invited Meetings','Job Openings','Quotes','Sales Orders','Purchase Orders','Emails','Invoices','Campaigns','Social','Reporting Employees','Zoho Desk','Voice of the Customer'];
    main.innerHTML=`<div class="z5-record-page"><div class="z5-module-title"><h1>Employees</h1></div><div class="z5-record-head"><button class="back" id="z5BackEmployees">←</button><span class="z5-record-avatar">${e.name[0]}</span><div class="title"><h2>${e.name}</h2><button>◆ Add Tags</button></div><div class="actions"><button class="z5-primary">Send Email</button><button>Edit</button><button>•••</button><button>‹</button><button>›</button></div></div><div class="z5-record-layout"><aside class="z5-related"><h3>Related List</h3>${related.map(x=>`<button>${x}</button>`).join('')}<button class="link">Add Related List</button><h3 class="z5-related-links-title">Links</h3><button class="link">Add Link</button></aside><section class="z5-record-content"><div class="z5-record-tabs"><button class="active">Overview</button><button>Timeline</button><span></span><small>◷ Last Update : 2 day(s) ago</small></div><div class="z5-record-scroll"><div class="z5-hide-details">Hide Details</div><section class="z5-record-owner">${field('Employee Owner','Recruitment Operations')}</section><section class="z5-layout-section"><h3>Personal Information</h3><div class="z5-fields-2">${field('Employee Name',e.name)}${field('Mobile',`${e.phone} ☎`)}${field('Email',`<a>${e.email}</a>`)}${field('Phone','—')}${field('Secondary Email',`<a>${e.name.toLowerCase().replace(/\s+/g,'.')}+work@example.test</a>`)}${field('Date of Birth','—')}${field('Social Lead ID','—')}</div></section><section class="z5-layout-section"><h3>Employment Information</h3><div class="z5-fields-2">${field('Current Facility',`<a>${e.facility}</a>`)}${field('Hire Date',hireDate)}${field('Department',e.department)}${field('Employee Status',e.status)}${field('Position',e.position)}${field('Reporting To','—')}${field('Employment Type',e.type)}${field('Termination Reason','—')}${field('Shift','7AM–3PM')}${field('Agency Affiliation','—')}</div></section><section class="z5-layout-section"><h3>Primary Recruitment Details</h3><div class="z5-fields-2">${field('Employee Owner','Recruitment Operations')}${field('Created By','Recruitment Operations<br><small>Fri, 28 Aug 2026 04:23 PM</small>')}${field('Applicant Source',e.source)}${field('Modified By','Recruitment Operations<br><small>Fri, 28 Aug 2026 04:24 PM</small>')}${field('Source Record','Applicant record linked')}</div></section><section class="z5-layout-section"><h3>Employment Records</h3><div class="z5-subform"><table><thead><tr><th>Updated At</th><th>Employee Status</th><th>Termination Reason</th><th>Position</th><th>Department</th><th>Facility</th><th>Recruiter Name</th><th>Endorsement Date</th></tr></thead><tbody><tr><td>Aug 31, 2026 09:12 AM</td><td>A</td><td>—</td><td>${e.position}</td><td>${e.department}</td><td>${e.facility}</td><td>${recruiter}</td><td>Aug 28, 2026 07:23 PM</td></tr><tr><td>Aug 28, 2026 07:24 PM</td><td>A</td><td>—</td><td>${e.position}</td><td>${e.department}</td><td>${e.facility}</td><td>${recruiter}</td><td>Aug 28, 2026 07:24 PM</td></tr></tbody></table></div><button class="z5-add-row">Add row</button></section><section class="z5-layout-section"><h3>Address Information</h3><div class="z5-fields-2">${field('Mailing Street','—')}${field('Other Street','—')}${field('Mailing City','Demo City')}${field('Other City','Demo City')}${field('Mailing State','NY')}${field('Other State','NY')}${field('Mailing Zip','10001')}${field('Other Zip','10001')}${field('Mailing Country','USA')}${field('Other Country','USA')}</div></section><section class="z5-layout-section"><h3>Description Information</h3><div class="z5-fields-2">${field('Description','Created from scheduled source synchronization. Linked to the originating applicant record and retained for audit traceability.','wide')}</div></section></div></section></div></div>`;
    document.getElementById('z5BackEmployees').onclick=renderEmployees;
  }

  function renderJobs(){
    const views=`<button data-z5-jobview="table" class="${state.jobView==='table'?'selected':''}" title="Table View">☷</button><button data-z5-jobview="kanban" class="${state.jobView==='kanban'?'selected':''}" title="Kanban View">▥</button>`;
    main.innerHTML=`${moduleHead('Job Openings',['All Job Openings'])}${toolbar({create:'Create Job Opening',views})}${state.jobView==='kanban'?jobKanban():jobTable()}`;
    document.querySelectorAll('[data-z5-jobview]').forEach(b=>b.onclick=()=>{state.jobView=b.dataset.z5Jobview;renderJobs()});
    document.querySelectorAll('[data-z5-job]').forEach(row=>row.onclick=()=>openJob(row.dataset.z5Job));
  }
  function jobKanban(){const groups=[['Closed','closed'],['Open','open'],['High Priority','high'],['Urgent','urgent'],['Critical','critical']];return `<div class="z5-kanban-tools"><button>Job Opening ▾</button><span></span></div><div class="z5-kanban-scroll jobs"><div class="z5-kanban">${groups.map(([name,cls])=>`<section class="z5-kcol"><header class="${cls}"><b>${name}</b><small>${jobs.filter(j=>j.group===name).length}</small><strong>${jobs.filter(j=>j.group===name).reduce((s,j)=>s+j.openings,0)}</strong></header><div class="z5-kbody">${jobs.filter(j=>j.group===name).map(j=>`<article data-z5-job="${j.id}"><b>${j.title}</b><span>${j.facility}</span><em class="${j.visibility==='Public'?'green':'orange'}">${j.visibility}</em><small>${j.openings}</small></article>`).join('')||'<div class="z5-empty">No Job Openings found.</div>'}</div></section>`).join('')}</div></div>`}
  function jobTable(){return tableView(['Job Opening ID','Posting Title','Facility','Openings','Status','Priority','Visibility'],jobs.map(j=>[j.id,j.title,j.facility,j.openings,j.status,j.group,j.visibility]),{linkFirst:true,rowAttr:i=>`data-z5-job="${jobs[i].id}"`})}

  function openJob(id){
    const j=jobs.find(x=>x.id===id)||jobs[0];
    const position=j.title.split(' - ')[0];
    const department=['CNA','RN','LPN'].includes(position)?'Nursing':position.includes('Respiratory')?'Respiratory Therapy':'Administration';
    const currentOpen=j.status==='Closed'?'—':'Aug 20, 2026';
    const currentClose=j.status==='Closed'?'Aug 20, 2026':'Sep 20, 2026';
    const related=['Notes','Connected Records','Attachments','Facilities','Recruitment Report Center'];
    const hiredRows=[['JOB-0003082026','Success','Aug 20, 2026','Jordan Blake','Recruiter A','A','FT','7AM–3PM','jordan.blake@example.test','+1 555 011 9981'],['JOB-0003082026','Success','Aug 24, 2026','Morgan Ellis','Recruiter B','A','FT','7AM–3PM','morgan.ellis@example.test','+1 555 016 2440']];
    const endorsed=[['APP-1802152','Success','Aug 20, 2026','Jordan Blake','jordan.blake@example.test','+1 555 011 9981','Recruiter A','Indeed','Endorsed candidate · synthetic record'],['APP-2949002','Success','Aug 24, 2026','Trevor Roth','trevor.roth@example.test','+1 555 013 8243','Recruiter B','LinkedIn','Endorsed candidate · synthetic record'],['APP-2949003','Success','Aug 24, 2026','Marlaina Stone','marlaina.stone@example.test','+1 555 019 4233','Recruiter C','Indeed','Endorsed candidate · synthetic record']];
    main.innerHTML=`<div class="z5-record-page"><div class="z5-module-title"><h1>Job Openings</h1></div><div class="z5-record-head"><button class="back" id="z5BackJobs">←</button><span class="z5-record-avatar">${position[0]}</span><div class="title"><h2>${j.title}</h2><button>◆ Add Tags</button></div><div class="actions"><button>Edit</button><button>•••</button><button>‹</button><button>›</button></div></div><div class="z5-record-layout"><aside class="z5-related"><h3>Related List</h3>${related.map(x=>`<button>${x}</button>`).join('')}<button class="link">Add Related List</button><h3 class="z5-related-links-title">Links</h3><button class="link">Add Link</button></aside><section class="z5-record-content"><div class="z5-record-tabs"><button class="active">Overview</button><button>Timeline</button><span></span><small>◷ Last Update : 6 day(s) ago</small></div><div class="z5-record-scroll"><div class="z5-hide-details">Hide Details</div><section class="z5-layout-section"><h3>Job Opening Information</h3><div class="z5-fields-2">${field('Job Opening Owner','Recruitment Operations')}${field('Created By','Recruitment Operations<br><small>Thu, 20 Aug 2026 02:22 PM</small>')}${field('Assigned Recruiters','Recruiter A, Recruiter B')}${field('Modified By','Recruitment Operations<br><small>Mon, 24 Aug 2026 12:09 PM</small>')}${field('Job Opening Active',j.status==='Open'?'✓':'—')}${field('Report - Job Opening','—')}</div></section><section class="z5-layout-section"><h3>Position Details</h3><div class="z5-fields-2">${field('Job Opening Name',j.title)}${field('Salary Range','$30,000 – $35,000 USD')}${field('Reference ID',j.id)}${field('Shift','7AM–3PM')}${field('Position',position)}${field('Original Open Date','—')}${field('Department',department)}${field('Current Open Date',currentOpen)}${field('Facility',`<a>${j.facility}</a>`)}${field('Current Close Date',currentClose)}${field('Employment Type','FT')}${field('Priority Level',`<em class="z5-status priority-${j.group.toLowerCase().replace(/\s+/g,'-')}">${j.group}</em>`)}${field('No. of Opening',j.openings)}${field('Posting Type',`<em class="z5-status posting-${j.visibility.toLowerCase()}">${j.visibility}</em>`)}</div></section><section class="z5-layout-section"><h3>Hiring Records</h3>${tableView(['Reference ID','Processing Status','Hired Date','Employee Name','Recruiter Name','Employee Status','Emp Type','Shift','Email','Phone'],hiredRows,{checkbox:false})}<button class="z5-add-row">Add row</button></section><section class="z5-layout-section"><h3>Endorsed Candidates</h3>${tableView(['Applicant CRM ID','Processing Status','Endorsement Date','Applicant Name','Email','Phone','Recruiter Name','Applicant Source','Note'],endorsed,{checkbox:false})}<button class="z5-add-row">Add row</button></section></div></section></div></div>`;
    document.getElementById('z5BackJobs').onclick=renderJobs;
  }

  function tableView(headers,rows,opts={}){return `<div class="z5-tablewrap ${opts.className||''}"><table class="z5-table"><thead><tr>${opts.checkbox===false?'':'<th class="check"><input type="checkbox"></th>'}${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr ${opts.rowAttr?opts.rowAttr(i):''}>${opts.checkbox===false?'':'<td><input type="checkbox"></td>'}${r.map((c,ci)=>`<td class="${ci===0&&opts.linkFirst?'z5-link':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}

  function openApplicant(id){
    const a=applicants.find(x=>x.id===id)||applicants[0];
    main.innerHTML=`<div class="z5-record-page"><div class="z5-module-title"><h1>Applicants</h1></div><div class="z5-record-head"><button class="back" id="z5BackApplicants">←</button><span class="z5-record-avatar">${a.name[0]}</span><div class="title"><h2>${a.name}</h2><button>◆ Add Tags</button></div><div class="actions"><button class="z5-primary">Send Email</button><button>Convert</button><button>Edit</button><button>Submit Candidate <span>▾</span></button><button>•••</button><button>‹</button><button>›</button></div></div><div class="z5-record-layout"><aside class="z5-related"><h3>Related List</h3>${['Notes','Recruitment Stage History','Connected Records','Cadences','Attachments','Job Openings','Open Activities','Closed Activities','Invited Meetings','Emails','Campaigns','Social','Zoho Desk','Voice of the Customer'].map((x,i)=>`<button data-z5-related="${x}">${x}${[0,1,4,7].includes(i)?` <small>${i===1?a.logs.length:1}</small>`:''}</button>`).join('')}<button class="link">Add Related List</button><h3>Links</h3><button class="link">Add Link</button></aside><section class="z5-record-content"><div class="z5-record-tabs"><button class="active" data-z5-recordtab="Overview">Overview</button><button data-z5-recordtab="Timeline">Timeline</button><span></span><small>◷ Last Update : 2 day(s) ago</small></div><div id="z5RecordBody"></div></section></div></div>`;
    document.getElementById('z5BackApplicants').onclick=renderApplicants;
    const body=document.getElementById('z5RecordBody');
    function draw(tab){document.querySelectorAll('[data-z5-recordtab]').forEach(b=>b.classList.toggle('active',b.dataset.z5Recordtab===tab));if(tab==='Overview')body.innerHTML=applicantOverview(a);else body.innerHTML=applicantTimeline(a)}
    document.querySelectorAll('[data-z5-recordtab]').forEach(b=>b.onclick=()=>draw(b.dataset.z5Recordtab));
    document.querySelectorAll('[data-z5-related]').forEach(b=>b.onclick=()=>openRelated(a,b.dataset.z5Related));
    draw('Overview');
  }

  function applicantOverview(a){return `<div class="z5-record-scroll"><section class="z5-layout-section"><h3>Current Application Detail</h3><div class="z5-fields-2">${field('Link to Job Opening',`<a>${a.jobOpening}</a>`)}${field('Shift',a.shift)}${field('Department',a.department)}${field('Tentative Start Date',a.tentativeStart)}${field('Position (Applied)',a.positionApplied)}${field('Available Date',a.availableDate)}${field('Emp Type',a.empType)}${field('Interview Schedule',a.interviewSchedule)}${field('Facilities',`<a>${a.facility}</a>`)}${field('Rate',a.rate)}${field('Expected Salary',a.expectedSalary)}${field('Blurb File',a.blurb)}${field('Salary Range',a.salaryRange)}${field('Hired Date',a.hiredDate)}${field('Recruiter Name',a.recruiter)}${field('Submission Status',`<em class="z5-status submitted">${a.submissionStatus}</em>`)}</div></section><section class="z5-layout-section"><h3>Recruitment Logs <small>Automated history</small></h3>${logsTable(a.logs)}</section><section class="z5-layout-section"><h3>Applicant Information</h3><div class="z5-fields-2">${field('Initial Contacted',a.initialContacted)}${field('Last Contacted',a.lastContacted)}${field('Applicant Email',a.email)}${field('Applicant Phone',a.phone)}${field('License',a.license)}${field('License Status',a.licenseStatus)}${field('Recent Job Position',a.recentPosition)}${field('Employer (Most Recent)',a.employer)}${field('Source',a.source)}${field('Sourcing Date',a.sourcingDate)}${field('Recruitment Stage',a.stage)}${field('HR RECRUITMENT CYCLE STAGE',a.hrStage)}</div></section><section class="z5-layout-section"><h3>AI Analysis</h3><div class="z5-ai-fields">${field('AI Score',`<b class="z5-score">${a.score}</b>`)}${field('Fit Level',a.fit)}${field('Recommendation',a.score>=80?'Proceed to Interview':'Recruiter Review')}${field('Processing Status','Completed')}${field('Justification','Candidate meets the core experience threshold and aligns with the role requirements.','wide')}${field('Key Skills','Role-specific experience, documentation, team coordination')}${field('Missing Skills','One preferred credential not confirmed')}${field('Experience Match','Strong')}${field('Education Match','Meets requirement')}</div></section></div>`}
  function logsTable(logs){return `<div class="z5-subform"><table><thead><tr><th>Job Opening</th><th>Event Date</th><th>Hired Date</th><th>Application Stage</th><th>Recruiter Name</th><th>Facility</th><th>Department</th><th>Position (Applied)</th><th>Emp Type</th></tr></thead><tbody>${logs.map(r=>`<tr><td>${r.job}</td><td>${r.event}</td><td>${r.hired}</td><td>${r.stage}</td><td>${r.recruiter}</td><td>${r.facility}</td><td>${r.department}</td><td>${r.position}</td><td>${r.empType}</td></tr>`).join('')}</tbody></table></div>`}
  function applicantTimeline(a){return `<div class="z5-record-scroll"><section class="z5-timeline"><article><time>Aug 31 · 04:23 PM</time><i></i><div><b>Applicant record updated</b><p>Recruitment stage and current application fields synchronized.</p></div></article><article><time>Aug 31 · 04:22 PM</time><i></i><div><b>Recruitment log appended automatically</b><p>Existing history preserved; a new event row was added by workflow automation.</p></div></article><article><time>Aug 31 · 09:42 AM</time><i></i><div><b>AI screening completed</b><p>Structured evaluation written back to the applicant record.</p></div></article><article><time>Aug 31 · 09:41 AM</time><i></i><div><b>Webhook sent to n8n</b><p>Application ID and selected candidate fields dispatched for processing.</p></div></article></section></div>`}
  function openRelated(a,name){const target=document.getElementById('z5RecordBody');if(!target)return;if(name==='Recruitment Stage History')target.innerHTML=`<div class="z5-record-scroll"><section class="z5-layout-section"><h3>Recruitment Stage History</h3>${logsTable(a.logs)}</section></div>`;else if(name==='Attachments')target.innerHTML=`<div class="z5-record-scroll"><section class="z5-layout-section"><h3>Attachments</h3><div class="z5-file"><span>▧</span><div><b>${a.resume}</b><small>PDF · synthetic demo file</small></div><button onclick="toast('Synthetic resume preview opened')">Preview</button></div><div class="z5-file"><span>▧</span><div><b>${a.blurb==='—'?'Candidate_Profile.pdf':a.blurb}</b><small>PDF · synthetic demo file</small></div><button onclick="toast('Synthetic profile preview opened')">Preview</button></div></section></div>`;else if(name==='Job Openings')target.innerHTML=`<div class="z5-record-scroll"><section class="z5-layout-section"><h3>Job Openings</h3>${tableView(['Job Opening','Facility','Position','Status'],[[a.jobOpening,a.facility,a.positionApplied,'Open']],{checkbox:false})}</section></div>`;else target.innerHTML=`<div class="z5-record-scroll"><section class="z5-layout-section"><h3>${name}</h3><p class="z5-muted">Synthetic related-list view for the reconstructed CRM record.</p></section></div>`}

  function openCreateApplicant(){
    main.innerHTML=`<div class="z5-module-title"><h1>Applicants</h1></div><div class="z5-create-head"><div><h2>Create Applicant <span class="z5-manual-badge">manual/admin fallback</span></h2><button>Recruitment Layout ▾</button><a>Edit Page Layout</a></div><div><button id="z5CancelCreate">Cancel</button><button id="z5SaveNew">Save and New</button><button class="z5-primary" id="z5SaveApplicant">Save</button></div></div><div class="z5-create-note"><b>Applicant intake was automated.</b> Recruiters normally did not create records manually. This page is included to show the configured CRM layout; Recruitment Logs were also appended by automation after stage changes.</div><form class="z5-create-form" id="z5ApplicantForm">${createSection('Applicant Image',`<div class="z5-image-placeholder">●</div>`)}${createSection('Basic Information',createRows([['Initial Contacted','zoho-date',''],['Last Contacted','zoho-date',''],['Last Name','text','Carter'],['Applicant Email','email','new.candidate@example.test'],['First Name','name','Taylor'],['Applicant Phone','tel','+1 555 010 0000']]))}${createSection('Experience and License',createRows([['License','select','-None-|RN|LPN|CNA|RRT'],['License Status','select','-None-|Active|Pending|Expired'],['Recent Job Position','text','Registered Nurse'],['GDrive Link','text',''],['Employer (Most Recent)','text','Regional Medical Center'],['Resume PDF','zoho-file','Choose file']]))}${createSection('Recruitment Tags',createRows([['Recruitment Stage','select','-None-|New|For Screening|For Interview|Offered|Hired|Inactive'],['HR RECRUITMENT CYCLE STAGE','select','-None-|New Applicant|Recruiter Review|Interview|Offer|Hired|Closed'],['Tagging','select','-None-|New Applicant|Priority Candidate|Standard|Retap'],['Result','select','-None-|Pending|Qualified|Not Qualified'],['Source','select','-None-|Social media|Indeed|LinkedIn|Employee Referral|Job Fair|Apploi|ZipRecruiter|Other'],['Offer Rejection Reason','select','-None-|Pay Rate|Benefits|Schedule|Distance|Got a Different Job Offer|Other'],['Sourcing Date','zoho-datetime','07:00 AM'],['Withdrawal Reason','select','-None-|Got Job Somewhere Else|Hiring Process Took Too Long|No Longer Interested|Other']]))}${createSection('Current Application Detail',createRows([['Link to Job Opening','lookup',''],['Shift','text','7AM–3PM'],['Department','select','-None-|Nursing|Administration|Respiratory Therapy|Dining Services'],['Tentative Start Date','zoho-date',''],['Position (Applied)','select','-None-|Registered Nurse|Licensed Practical Nurse|Certified Nursing Assistant|Respiratory Therapist|Unit Clerk'],['Available Date','zoho-datetime','07:00 AM'],['Emp Type','select','-None-|FT|PT|PRN'],['Interview Schedule','zoho-datetime','07:00 AM'],['Facilities','lookup',''],['Rate','select','Hourly|Annual|Monthly'],['Expected Salary','currency',''],['Blurb File','zoho-file','Choose file'],['Salary Range','text',''],['Hired Date','zoho-datetime','07:00 AM'],['Recruiter Name','select','None|Recruiter A|Recruiter B|Recruiter C|Recruiter D'],['Submission Status','select','Draft|Submitted']]))}<section class="z5-auto-section"><h3>Recruitment Logs</h3><div><b>Automation-managed section</b><p>Recruitment history is shown on existing applicant records. New stage rows are appended automatically; recruiters do not type the Recruitment Logs subform during intake.</p></div></section></form>`;
    document.getElementById('z5CancelCreate').onclick=renderApplicants;
    const save=()=>{toast('Synthetic applicant saved · production intake was normally automated');renderApplicants()};document.getElementById('z5SaveApplicant').onclick=save;document.getElementById('z5SaveNew').onclick=()=>toast('Synthetic save completed · blank form retained for demo')
  }
  function createSection(title,body){return `<section class="z5-form-section"><h3>${title}</h3>${body}</section>`}
  function createRows(fields){return `<div class="z5-form-grid">${fields.map(([label,type,value])=>formField(label,type,value)).join('')}</div>`}
  function formField(label,type='text',value=''){
    if(type==='select'){const opts=String(value||'None').split('|');return `<label><span>${label}</span><select>${opts.map(o=>`<option>${o}</option>`).join('')}</select></label>`}
    if(type==='name')return `<label><span>${label}</span><div class="z5-name-input"><select><option>-None-</option><option>Mr.</option><option>Ms.</option><option>Mrs.</option></select><input value="${escapeHtml(value||'')}"></div></label>`;
    if(type==='lookup')return `<label><span>${label}</span><div class="z5-lookup-input"><input value="${escapeHtml(value||'')}"><button type="button">▣</button></div></label>`;
    if(type==='currency')return `<label><span>${label}</span><div class="z5-currency-input"><b>$</b><input value="${escapeHtml(value||'')}"></div></label>`;
    if(type==='zoho-date')return `<label><span>${label}</span><input type="text" placeholder="MMM D, YYYY" value="${escapeHtml(value||'')}"></label>`;
    if(type==='zoho-datetime')return `<label><span>${label}</span><div class="z5-datetime-input"><input type="text" placeholder="MMM D, YYYY"><select><option>${escapeHtml(value||'07:00 AM')}</option><option>08:00 AM</option><option>09:00 AM</option></select></div></label>`;
    if(type==='zoho-file')return `<label><span>${label}</span><button type="button" class="z5-file-input">${escapeHtml(value||'Choose file')} <span>▾</span></button></label>`;
    if(type==='file')return `<label><span>${label}</span><input type="file"></label>`;
    return `<label><span>${label}</span><input type="${type}" value="${escapeHtml(value||'')}"></label>`
  }

  function renderFacilities(){main.innerHTML=`${moduleHead('Facilities',['All Facilities'])}${toolbar({create:'Create Facility'})}${tableView(['Facility Code','Facility Name','Industry','State','Open Roles','Status'],facilities.map(f=>[f.code,f.name,'Healthcare',f.state,f.openRoles,f.status]))}`}
  function simpleList(title,headers,rows,create){main.innerHTML=`${moduleHead(title)}${toolbar({create})}${tableView(headers,rows)}`}

  function renderReportCenter(){
    main.innerHTML=`${moduleHead('Recruitment Report Center',['All Recruitment Reports'])}<div class="z5-listtoolbar"><div><button>⌕ Filter</button><button>⇅ Sort</button><button>☷</button></div><button class="z5-primary" id="z5CreateReportCenter">Create Recruitment Report <span>▾</span></button></div><div class="z5-list-note"><b>Automation-backed reporting module.</b> Each record stores the report period and summary fields at the parent level; the detailed Facility → Position output is stored in the report subform.</div><div class="z5-report-center-wrap">${tableView(['Report Name','Report Type','Owner','Period Type','Period Label','Generated','Rows'],reportCenterRecords.map(r=>[r.name,r.reportType,r.owner,r.periodType,r.periodLabel,r.generated,r.totalRows]),{linkFirst:true,rowAttr:i=>`data-z5-reportcenter="${reportCenterRecords[i].id}"`})}<div class="z5-footer"><span>Total Records&nbsp; <b>${reportCenterRecords.length}</b></span><span>1 to ${reportCenterRecords.length}</span></div></div>`;
    document.querySelectorAll('[data-z5-reportcenter]').forEach(r=>r.onclick=()=>openReportCenterRecord(r.dataset.z5Reportcenter));
    document.getElementById('z5CreateReportCenter').onclick=openCreateReportCenter;
  }
  function openReportCenterRecord(id){const r=reportCenterRecords.find(x=>x.id===id)||reportCenterRecords[0];main.innerHTML=customRecordLayout({module:'Recruitment Report Center',record:r.name,id:r.id,actions:['Edit','Export Excel'],note:'This saved report record is populated from CRM recruitment activity. Parent fields describe the reporting period; the subform holds the generated Facility → Position output.',details:[['Report Name',r.name],['Report Type',r.reportType],['Report Owner',r.owner],['Period Type',r.periodType],['Period Start',r.periodStart],['Period End',r.periodEnd],['Period Label',r.periodLabel],['Generated',r.generated],['Total Output Rows',r.totalRows],['Grouping','Facility → Position']],subTitle:'Report Output',columns:r.columns,rows:r.rows,back:renderReportCenter});wireCustomRecord(r.name,r.columns,r.rows,renderReportCenter)}
  function openCreateReportCenter(){
    main.innerHTML=`<div class="z5-module-title"><h1>Recruitment Report Center</h1></div><div class="z5-create-head"><div><h2>Create Recruitment Report</h2><a>Edit Page Layout</a></div><div><button id="z5CancelReportCreate">Cancel</button><button>Save and New</button><button class="z5-primary">Save</button></div></div><div class="z5-create-note"><b>Generated report records.</b> In production these records are created/populated by reporting automation; this layout is shown only to demonstrate the configured custom module.</div><form class="z5-create-form">${createSection('Recruitment Report Information',createRows([['Report Name','text','Applicant & Sourcing — Week 36 2026'],['Report Owner','select','CRM Reporting|Recruitment Operations'],['Report Type','select','Recruitment Activity|Candidate Loss Analysis|Job Opening History|Applicant & Sourcing'],['Period Type','select','Daily|Weekly|Monthly|YTD'],['Period Start','date'],['Period End','date'],['Period Label','text','Week 36 · Aug 31–Sep 6, 2026'],['Generated','text','Auto-generated'],['Grouping','text','Facility → Position']]))}<section class="z5-auto-section"><h3>Report Output</h3><div><b>Automation-managed subform</b><p>The Facility → Position rows are generated from candidate/job-opening activity and written to the report record automatically.</p></div></section></form>`;
    document.getElementById('z5CancelReportCreate').onclick=renderReportCenter;
  }

  function renderRecruiterActivityReports(){
    main.innerHTML=`${moduleHead('Recruiter Activity Reports',['All Recruiter Activity Reports'])}<div class="z5-listtoolbar"><div><button>⌕ Filter</button><button>⇅ Sort</button><button>☷</button></div><button class="z5-primary" id="z5CreateRAR">Create Recruiter Activity Report <span>▾</span></button></div><div class="z5-list-note"><b>Saved activity reports.</b> Open a row to view a completed sample record. The parent fields describe the report; the Activity Records subform contains the generated list output.</div><div class="z5-report-center-wrap">${tableView(['Recruiter Activity Report Name','Owner','Period Type','Period Label','Activity Type','Total Activities','Week Number','Report Year'],activityReportRecords.map(r=>[r.name,r.owner,r.periodType,r.periodLabel,r.activityType,r.totalActivities,r.weekNumber,r.reportYear]),{linkFirst:true,rowAttr:i=>`data-z5-rar="${activityReportRecords[i].id}"`})}<div class="z5-footer"><span>Total Records&nbsp; <b>${activityReportRecords.length}</b></span><span>1 to ${activityReportRecords.length}</span></div></div>`;
    document.querySelectorAll('[data-z5-rar]').forEach(r=>r.onclick=()=>openRecruiterActivityRecord(r.dataset.z5Rar));document.getElementById('z5CreateRAR').onclick=openCreateRAR;
  }
  function openRecruiterActivityRecord(id){const r=activityReportRecords.find(x=>x.id===id)||activityReportRecords[0];main.innerHTML=customRecordLayout({module:'Recruiter Activity Reports',record:r.name,id:r.id,actions:['Edit','Export Excel'],note:'This is a completed sample record, not the create screen. Report header fields describe the period and ownership; Activity Records below are the generated subform rows.',details:[['Recruiter Activity Report Name',r.name],['Recruiter Activity Report Owner',r.owner],['Email',r.email],['Secondary Email',r.secondaryEmail||'—'],['Exchange Rate','1'],['Period Type',r.periodType],['Report Day',r.reportDay],['Period Start',r.periodStart],['Report Month',r.reportMonth],['Period End',r.periodEnd],['Period Label',r.periodLabel],['Activity Type',r.activityType],['Total Activities',r.totalActivities],['Week Number',r.weekNumber],['Report Year',r.reportYear]],subTitle:'Activity Records',columns:['Activity Type','Candidate Name','Phone','Email','Facility','Position'],rows:r.rows,back:renderRecruiterActivityReports});wireCustomRecord(r.name,['Activity Type','Candidate Name','Phone','Email','Facility','Position'],r.rows,renderRecruiterActivityReports)}
  function customRecordLayout({module,record,id,actions,details,subTitle,columns,rows,note=''}){return `<div class="z5-report-record"><div class="z5-module-title"><h1>${module}</h1></div><div class="z5-custom-head"><button id="z5CustomBack">←</button><span class="z5-docicon">▧</span><div><h2>${record}</h2><small>${id}</small></div><div class="actions">${actions.map((a,i)=>`<button class="${i===actions.length-1?'z5-primary':''}" data-z5-custom-action="${a}">${a}</button>`).join('')}<button>•••</button></div></div><div class="z5-custom-tabs"><button class="active">Overview</button><button>Timeline</button><span></span><small>◷ Last Update : today</small></div><div class="z5-custom-scroll">${note?`<div class="z5-automation-note"><span>ⓘ</span><div><b>Demo record</b><br>${note}</div></div>`:''}<section class="z5-layout-section"><h3>${module==='Recruiter Activity Reports'?'Recruiter Activity Report Information':'Recruitment Report Information'}</h3><div class="z5-readonly-grid">${details.map(([k,v])=>field(k,v)).join('')}</div></section><section class="z5-layout-section"><h3>${subTitle}</h3><div class="z5-subform report-output"><table><thead><tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section></div></div>`}
  function wireCustomRecord(name,cols,rows,back){document.getElementById('z5CustomBack').onclick=back;document.querySelectorAll('[data-z5-custom-action]').forEach(b=>b.onclick=()=>{if(b.dataset.z5CustomAction==='Export Excel')exportRows(name,cols,rows);else toast('Synthetic report record opened in edit mode')})}
  function exportRows(name,cols,rows){const html=`<table><tr>${cols.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</table>`;const blob=new Blob([html],{type:'application/vnd.ms-excel'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${name.replace(/[^a-z0-9]+/gi,'_')}.xls`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Excel-compatible export created')}
  function openCreateRAR(){main.innerHTML=`<div class="z5-module-title"><h1>Recruiter Activity Reports</h1></div><div class="z5-create-head"><div><h2>Create Recruiter Activity Report</h2><a>Edit Page Layout</a></div><div><button id="z5CancelRAR">Cancel</button><button>Save and New</button><button class="z5-primary">Save</button></div></div><form class="z5-create-form">${createSection('Recruiter Activity Report Information',createRows([['Recruiter Activity Report Name','text','Weekly Recruitment Activity — W36 2026'],['Recruiter Activity Report Owner','select','CRM Reporting|Recruiter A|Recruiter B'],['Email','email','recruiting-ops@example.test'],['Secondary Email','email',''],['Exchange Rate','text','1'],['Period Type','select','Daily|Weekly|Monthly|YTD'],['Report Day','date'],['Period Start','date'],['Report Month','text','September 2026'],['Period End','date'],['Period Label','text','Aug 31–Sep 6, 2026'],['Activity Type','select','All Recruitment Activity|Applied|Sourced|Contacted|Interview Scheduled'],['Total Activities','number','0'],['Week Number','number','36'],['Report Year','number','2026']]))}<section class="z5-form-section"><h3>Activity Records</h3><div class="z5-subform"><table><thead><tr><th>Activity Type</th><th>Candidate Name</th><th>Phone</th><th>Email</th><th>Facility</th><th>Position</th></tr></thead><tbody><tr>${['Activity Type','Candidate Name','Phone','Email','Facility','Position'].map(()=>'<td><input></td>').join('')}</tr></tbody></table></div></section></form>`;document.getElementById('z5CancelRAR').onclick=renderRecruiterActivityReports}

  function dashboardVisuals(){
    const sourceDonut = `
      <div class="z5-source-donut-wrap">
        <svg class="z5-source-donut" viewBox="0 0 760 300" role="img" aria-label="Candidate Source donut chart">
          <g transform="rotate(-90 380 150)">
            <circle class="donut-bg" cx="380" cy="150" r="82"></circle>
            <circle cx="380" cy="150" r="82" pathLength="100" stroke="#d8cc3b" stroke-dasharray="45 55" stroke-dashoffset="0"></circle>
            <circle cx="380" cy="150" r="82" pathLength="100" stroke="#e72d4d" stroke-dasharray="21 79" stroke-dashoffset="-45"></circle>
            <circle cx="380" cy="150" r="82" pathLength="100" stroke="#5ea0b8" stroke-dasharray="12 88" stroke-dashoffset="-66"></circle>
            <circle cx="380" cy="150" r="82" pathLength="100" stroke="#f27d27" stroke-dasharray="8 92" stroke-dashoffset="-78"></circle>
            <circle cx="380" cy="150" r="82" pathLength="100" stroke="#4c89d8" stroke-dasharray="6 94" stroke-dashoffset="-86"></circle>
            <circle cx="380" cy="150" r="82" pathLength="100" stroke="#58c8b8" stroke-dasharray="8 92" stroke-dashoffset="-92"></circle>
          </g>
          <circle class="donut-hole" cx="380" cy="150" r="48"></circle>
          <g class="z5-donut-callout left">
            <path d="M303 92 C260 75 230 70 190 70 L146 70" stroke="#e72d4d"></path>
            <text x="138" y="64" text-anchor="end">ZipRecruiter</text><text x="138" y="79" text-anchor="end">88 · 21%</text>
            <path d="M301 180 C260 194 230 213 190 213 L146 213" stroke="#d8cc3b"></path>
            <text x="138" y="207" text-anchor="end">Indeed</text><text x="138" y="222" text-anchor="end">186 · 45%</text>
            <path d="M319 221 C280 245 235 252 190 252 L146 252" stroke="#58c8b8"></path>
            <text x="138" y="246" text-anchor="end">Other</text><text x="138" y="261" text-anchor="end">33 · 8%</text>
          </g>
          <g class="z5-donut-callout right">
            <path d="M446 95 C493 78 526 70 572 70 L617 70" stroke="#5ea0b8"></path>
            <text x="625" y="64">Candidate Upload</text><text x="625" y="79">50 · 12%</text>
            <path d="M458 144 C505 142 534 135 572 135 L617 135" stroke="#f27d27"></path>
            <text x="625" y="129">Facebook</text><text x="625" y="144">33 · 8%</text>
            <path d="M442 206 C490 224 526 236 572 236 L617 236" stroke="#4c89d8"></path>
            <text x="625" y="230">Employee Referral</text><text x="625" y="245">25 · 6%</text>
          </g>
        </svg>
      </div>`;
    const lineChart = `
      <div class="z5-area-chart">
        <div class="z5-area-legend"><span><i class="teal"></i>Applied</span><span><i class="blue"></i>Sourced</span></div>
        <svg viewBox="0 0 1000 300" role="img" aria-label="Weekly Applicant and Sourcing trend">
          <g class="grid"><line x1="74" y1="38" x2="960" y2="38"></line><line x1="74" y1="92" x2="960" y2="92"></line><line x1="74" y1="146" x2="960" y2="146"></line><line x1="74" y1="200" x2="960" y2="200"></line><line x1="74" y1="254" x2="960" y2="254"></line></g>
          <g class="axis-labels"><text x="52" y="258">0</text><text x="43" y="204">20</text><text x="43" y="150">40</text><text x="43" y="96">60</text><text x="43" y="42">80</text></g>
          <path class="area teal" d="M80 224 L225 191 L370 204 L515 156 L660 176 L805 131 L950 151 L950 254 L80 254 Z"></path>
          <path class="area blue" d="M80 252 L225 174 L370 191 L515 115 L660 139 L805 82 L950 102 L950 254 L80 254 Z"></path>
          <polyline class="line teal" points="80,224 225,191 370,204 515,156 660,176 805,131 950,151"></polyline>
          <polyline class="line blue" points="80,252 225,174 370,191 515,115 660,139 805,82 950,102"></polyline>
          <g class="dots teal"><circle cx="80" cy="224" r="4"></circle><circle cx="225" cy="191" r="4"></circle><circle cx="370" cy="204" r="4"></circle><circle cx="515" cy="156" r="4"></circle><circle cx="660" cy="176" r="4"></circle><circle cx="805" cy="131" r="4"></circle><circle cx="950" cy="151" r="4"></circle></g>
          <g class="dots blue"><circle cx="80" cy="252" r="4"></circle><circle cx="225" cy="174" r="4"></circle><circle cx="370" cy="191" r="4"></circle><circle cx="515" cy="115" r="4"></circle><circle cx="660" cy="139" r="4"></circle><circle cx="805" cy="82" r="4"></circle><circle cx="950" cy="102" r="4"></circle></g>
          <g class="xlabels"><text x="72" y="282">W1</text><text x="217" y="282">W2</text><text x="362" y="282">W3</text><text x="507" y="282">W4</text><text x="652" y="282">W5</text><text x="797" y="282">W6</text><text x="942" y="282">W7</text></g>
          <text class="axis-title y" x="14" y="155" transform="rotate(-90 14 155)">Applicant Count</text><text class="axis-title x" x="505" y="298">Week</text>
        </svg>
      </div>`;
    return {sourceDonut,lineChart};
  }

  function renderDashboard(tab='Analytics'){
    setTopActive(tab);
    moduleButtons.forEach(b=>b.classList.remove('active'));
    const {sourceDonut,lineChart}=dashboardVisuals();
    main.innerHTML=`<div class="z5-module-title"><h1>${tab}</h1></div>
      <div class="z5-analytics-controls"><div><button>All ▾</button><button>☆ Org Overview ▾</button><button>◉ All Users</button></div><div><button title="Refresh">↻</button><button>Add Component</button><button class="z5-primary">Create Dashboard</button><button>•••</button><button>?</button></div></div>
      <div class="z5-dashboard">
        <section class="z5-widget kpi"><small>KPI</small><strong>186</strong><h3>Applicants YTD</h3><p>All facilities</p></section>
        <section class="z5-widget kpi"><small>KPI</small><strong>126</strong><h3>Interviews Scheduled YTD</h3><p>67.7% of applicants</p></section>
        <section class="z5-widget kpi"><small>KPI</small><strong>30</strong><h3>Hired YTD</h3><p>16.1% conversion</p></section>
        <section class="z5-widget funnel zoho-funnel-widget"><small>FUNNEL</small><h3>Applicant & Sourcing Funnel</h3><div class="z5-funnel-zoho"><div class="stage red" style="width:82%"><b>Applied</b><strong>186</strong></div><span class="rate">76%</span><div class="stage amber" style="width:66%"><b>Sourced</b><strong>142</strong></div><span class="rate">89%</span><div class="stage lime" style="width:54%"><b>Contacted</b><strong>126</strong></div><span class="rate">61%</span><div class="stage cyan" style="width:42%"><b>Interview Scheduled</b><strong>77</strong></div><div class="z5-funnel-legend"><span><i class="red"></i>Applied</span><span><i class="amber"></i>Sourced</span><span><i class="lime"></i>Contacted</span><span><i class="cyan"></i>Interview Scheduled</span></div><p>Conversion Rate: <b>41%</b></p></div></section>
        <section class="z5-widget donut source-donut-widget"><small>DONUT CHART</small><h3>Candidate Source</h3>${sourceDonut}</section>
        <section class="z5-widget comparator"><small>COMPARATOR</small><h3>Recruiting Conversion by Facility</h3>${[['North Harbor',72],['Riverside',66],['Pinecrest',69],['Greenfield',61]].map(([n,v])=>`<div class="z5-bar"><span>${n}</span><i><b style="width:${v}%"></b></i><strong>${v}%</strong></div>`).join('')}</section>
        <section class="z5-widget hbar"><small>HORIZONTAL BAR CHART</small><h3>Withdrawal Reasons</h3>${[['Got Job Somewhere Else',64],['Process Took Too Long',45],['No Longer Interested',32],['Other',18]].map(([n,v])=>`<div class="z5-bar"><span>${n}</span><i><b style="width:${v}%"></b></i><strong>${v}</strong></div>`).join('')}</section>
        <section class="z5-widget line large"><small>AREA / LINE CHART</small><h3>Weekly Applicant & Sourcing Trend</h3>${lineChart}</section>
        <section class="z5-widget table"><small>TABLE CHART</small><h3>Job Opening Aging</h3>${tableView(['Facility','Position','Status','Days Open'],[['North Harbor Care','CNA','Open','211'],['Greenfield Care','RRT','Open','103'],['North Harbor Care','RN','Open','91'],['Riverside Health','RN','Open','44']],{checkbox:false})}</section>
      </div>`;
    main.querySelectorAll('.z5-analytics-controls button').forEach(b=>b.onclick=()=>toast('Dashboard control opened in demo'));
  }

  const nativeReports=[
    {id:'NR-01',name:'Recruitment Activity by Facility & Position',desc:'Pipeline movement, interviews, outcomes, and hires.',accessed:'Aug 31, 2026',record:'RPT-001'},
    {id:'NR-02',name:'Candidate Loss Reasons',desc:'Withdrawal and offer rejection reasons by facility and position.',accessed:'Aug 31, 2026',record:'RPT-002'},
    {id:'NR-03',name:'Job Opening History',desc:'Open, closed, reopened history and current days open.',accessed:'Aug 30, 2026',record:'RPT-003'},
    {id:'NR-04',name:'Applicant & Sourcing by Facility & Position',desc:'Applied, sourced, contacted, and interview scheduled with running totals.',accessed:'Aug 31, 2026',record:'RPT-004'},
    {id:'NR-05',name:'Time to Hire',desc:'Elapsed time from application through hire.',accessed:'Aug 29, 2026',record:'RPT-001'},
    {id:'NR-06',name:'Hires and Terms by Facility',desc:'Employment movement summarized by facility.',accessed:'Aug 28, 2026',record:'RPT-001'}
  ];
  function renderNativeReports(){
    setTopActive('Reports');moduleButtons.forEach(b=>b.classList.remove('active'));
    main.innerHTML=`<div class="z5-module-title"><h1>Reports</h1></div><div class="z5-native-reports-tools"><div><button>Recruitment Reports ▾</button><button title="Public reports">◉</button><button>•••</button></div><div><label>⌕ <input id="z5ReportSearch" placeholder="Search Recruitment Reports"></label><button class="z5-primary">Create Report</button><button>?</button></div></div><div class="z5-native-reports-list"><table><thead><tr><th class="check"><input type="checkbox"></th><th>Report Name</th><th>Description</th><th>Last Accessed Date</th></tr></thead><tbody>${nativeReports.map(r=>`<tr data-z5-native-report="${r.id}"><td><input type="checkbox"></td><td><span class="z5-star">☆</span><a>${r.name}</a></td><td>${r.desc}</td><td>${r.accessed}</td></tr>`).join('')}</tbody></table></div>`;
    main.querySelectorAll('[data-z5-native-report]').forEach(r=>r.onclick=e=>{if(e.target.tagName==='INPUT')return;openNativeReport(r.dataset.z5NativeReport)});
    document.getElementById('z5ReportSearch').oninput=e=>{const q=e.target.value.toLowerCase();main.querySelectorAll('[data-z5-native-report]').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none')};
  }
  function openNativeReport(id){
    const n=nativeReports.find(x=>x.id===id)||nativeReports[0];const r=reportCenterRecords.find(x=>x.id===n.record)||reportCenterRecords[0];
    main.innerHTML=`<div class="z5-module-title"><h1>Reports</h1></div><div class="z5-native-report-head"><button id="z5NativeReportBack">←</button><div><h2>${n.name}</h2><small>Recruitment Reports · Last accessed ${n.accessed}</small></div><div><button>Customize</button><button class="z5-primary" id="z5NativeExport">Export</button><button>•••</button></div></div><div class="z5-report-filterbar"><button>Facility: All ▾</button><button>Position: All ▾</button><button>Period: ${r.periodType} ▾</button><button>Run</button></div><div class="z5-native-report-output"><div class="z5-report-summary"><span>Grouping<b>Facility → Position</b></span><span>Period<b>${r.periodLabel}</b></span><span>Rows<b>${r.totalRows}</b></span></div>${tableView(r.columns,r.rows,{checkbox:false})}</div>`;
    document.getElementById('z5NativeReportBack').onclick=renderNativeReports;document.getElementById('z5NativeExport').onclick=()=>exportRows(n.name,r.columns,r.rows);
  }

  function renderWorkqueue(view='tasks'){
    setTopActive('Workqueue');moduleButtons.forEach(b=>b.classList.remove('active'));
    const datasets={
      tasks:{title:'Tasks',headers:['Subject','Due Date','Status','Priority','Job Opening'],rows:[]},
      meetings:{title:'Meetings',headers:['Subject','Start Time','Status','Facility','Candidate'],rows:[]},
      calls:{title:'Calls',headers:['Subject','Scheduled','Status','Owner','Candidate'],rows:[]},
      employees:{title:'My Employees',headers:['Employee','Facility','Department','Status','Start Date'],rows:[['Emily Carter','North Harbor Care','Nursing','Active','Sep 14, 2026'],['Jordan Lee','Riverside Health','Administration','Active','Aug 24, 2026']]},
      applicants:{title:'My Applicants',headers:['Applicant','Position','Facility','Stage','Source'],rows:[['Calvin Brooks','RRT','Greenfield Care','For Screening','Indeed'],['Shivani Patel','CNA','Riverside Health','For Interview','Apploi'],['Francis Torres','RN Supervisor','Brookview Health','Offered','Indeed']]}
    };const d=datasets[view]||datasets.tasks;
    main.innerHTML=`<div class="z5-module-title"><h1>Workqueue</h1></div><div class="z5-workqueue-tabs"><div class="active"><span class="z5-wq-avatar">R</span><div><b>Recruitment Manager</b><small>Manager</small></div></div><button>＋</button></div><div class="z5-workqueue"><aside><section><h3>My Open Activity</h3><button class="z5-wq-select">Today & Overdue <span>⌄</span></button><button data-z5-wq="tasks" class="${view==='tasks'?'active':''}">☑ Tasks <em>0</em></button><button data-z5-wq="meetings" class="${view==='meetings'?'active':''}">▦ Meetings <em>0</em></button><button data-z5-wq="calls" class="${view==='calls'?'active':''}">☎ Calls <em>0</em></button></section><section><h3>My Jobs</h3><button>⌘ Blueprint <em>0</em></button></section><section><h3>My Workqueue <span>⚙ ＋</span></h3><h4>Campaigns</h4><button>⚑ My Active Campaigns <em>0</em></button><h4>Employees</h4><button data-z5-wq="employees" class="${view==='employees'?'active':''}">▣ Employees assigned recently <em>0</em></button><button data-z5-wq="employees">▣ My Employees <em>32</em></button><h4>Applicants</h4><button data-z5-wq="applicants" class="${view==='applicants'?'active':''}">◎ Applicants assigned recently <em>0</em></button><button data-z5-wq="applicants">◎ My Applicants <em>999+</em></button></section></aside><section class="z5-workqueue-main"><div class="z5-wq-title"><h2>${d.title} <span>↻</span></h2><button>⌕ Filter</button></div>${d.rows.length?tableView(d.headers,d.rows,{checkbox:false}):`<div class="z5-wq-empty"><div class="z5-wq-empty-head">${d.headers.map(h=>`<span>${h}</span>`).join('')}</div><p>No ${d.title} found.</p></div>`}<div class="z5-footer"><span>Total Records&nbsp; <b>${d.rows.length}</b></span></div></section></div>`;
    main.querySelectorAll('[data-z5-wq]').forEach(b=>b.onclick=()=>renderWorkqueue(b.dataset.z5Wq));
  }

  const workflowRules=[
    ['Applicants - Resume - Archive Document','Applicants','Create or Edit','1','Aug 29, 2026',true],
    ['Applicants - Reporting - Log Stage Change','Applicants','Modified','1','Aug 29, 2026',true],
    ['Employees - Sync - Update Employee Record','Employees','Modified','1','Aug 29, 2026',true],
    ['Job Openings - Tasks - Create Recruiter Tasks','Job Openings','Create or Edit','1','Aug 28, 2026',true],
    ['Applicants - Submission - Submit Candidate','Applicants','Modified','4','Aug 28, 2026',true],
    ['Employees - Termination - Process Termination','Employees','Modified','1','Aug 28, 2026',true],
    ['Applicants - HR Stage - Mark Qualified','Applicants','Modified','1','Aug 28, 2026',true],
    ['Job Openings - Status - Close When Filled','Job Openings','Modified','1','Aug 28, 2026',true],
    ['Applicants - HR Stage - Mark Rejected','Applicants','Modified','3','Aug 28, 2026',true],
    ['Job Openings - Reports - Update Opening History','Job Openings','Create or Edit','1','Aug 28, 2026',true],
    ['Applicants - HR Stage - Mark Interview Scheduled','Applicants','Modified','3','Aug 28, 2026',true]
  ];
  const schedules=[
    ['sync_source_applicants','Aug 28, 2026','In 13 hours','Daily',true],['generateDailyRecruiterActivity','Aug 28, 2026','Completed','Once',false],['daily_reporting_snapshot','Aug 28, 2026','In 15 hours','Daily',true],['reconcile_job_openings','Aug 28, 2026','In 17 hours','Daily',true],['retry_failed_integrations','Aug 28, 2026','Completed','Once',false]
  ];
  const functionNames=['AttachGoogleDriveFileToLead','Recruitment Logs - Fill','Fill Applicant From JobOpening','Endorse Applicant To JobOpening - Btn','Employment Update','source_sync_scheduled','Daily Report','GenerateDailyReportingSnapshots','Create Recruiter Tasks For JobOpening'];
  const actualLogs={
    'Fill Applicant From JobOpening':[['Aug 28, 2026 04:12 PM','200','Success','1687'],['Aug 24, 2026 12:09 PM','200','Success','1844'],['Aug 24, 2026 12:00 PM','200','Success','1481'],['Aug 20, 2026 02:24 PM','200','Success','1321'],['Aug 18, 2026 05:30 PM','200','Success','1419']],
    'Recruitment Logs - Fill':[['Aug 28, 2026 04:50 PM','200','Success','1506'],['Aug 28, 2026 04:23 PM','200','Success','1588'],['Aug 28, 2026 04:18 PM','200','Success','1865'],['Aug 24, 2026 12:09 PM','200','Success','1250'],['Aug 24, 2026 12:09 PM','200','Success','1867'],['Aug 24, 2026 12:00 PM','200','Success','1560'],['Aug 24, 2026 12:00 PM','200','Success','1720'],['Aug 24, 2026 11:44 AM','200','Success','882'],['Aug 24, 2026 11:44 AM','200','Success','968'],['Aug 24, 2026 11:44 AM','200','Success','920'],['Aug 24, 2026 11:44 AM','200','Success','1140'],['Aug 24, 2026 11:43 AM','200','Success','643'],['Aug 24, 2026 11:43 AM','200','Success','1044'],['Aug 24, 2026 11:43 AM','200','Success','887']]
  };
  function setupSidebar(section){
    if(section==='functions'){
      return `<a>Setup Home</a><label>⌕ <input placeholder="Search"></label>
        <button>Variables</button><button>Circuits</button>
        <button data-z5-setup="functions" class="active">Functions</button>
        <button>Widgets</button><button>Data Model</button><button>StyleUI ✦</button><button>Queries</button><button>Client Script</button><button>Catalyst Solutions</button>
        <h3>Zia</h3><button>Agents ✦</button><button>Data Enrichment</button><button>Prediction</button><button>Recommendation</button><button>Communication</button><button>Vision</button><button>Notifications</button><button>Voice of the Customer ✦</button><button>Models</button><button>Presentation</button><button>Custom AI Studio</button><button>Competitors</button><button>Usage Data</button>
        <h3>CPQ</h3><button>Product Configurator</button><button>Price Rules</button><button>Guided Selling</button>`;
    }
    return `<a>Setup Home</a><label>⌕ <input placeholder="Search"></label><h3>Customization</h3><button>Modules and Fields</button><button>Wizards</button><button>Canvas ✦</button><h3>Automation</h3><button data-z5-setup="workflows" class="${section==='workflows'?'active':''}">Workflow Rules</button><button>Actions</button><button data-z5-setup="schedules" class="${section==='schedules'?'active':''}">Schedules</button><button>Assignment</button><button>Scoring Rules</button><button>Cadences</button><h3>Process Management</h3><button>Blueprint</button><button>Approval Processes</button><button>Review Processes</button><h3>Developer Space</h3><button data-z5-setup="functions">Functions</button><button>Widgets</button><button>Data Model</button><button>Queries</button><button>Client Script</button>`;
  }

  function renderSetup(section='workflows',fnName=null,fnTab='overview'){
    root.innerHTML=`<div class="z5-setup-shell"><header class="z5-setup-top"><b>Setup</b><button>Admin Panel</button><button class="active">CRM</button><span></span><button id="z5SetupClose">×</button></header><div class="z5-setup-body"><aside class="z5-setup-side">${setupSidebar(section)}</aside><main class="z5-setup-main" id="z5SetupMain"></main></div></div>`;
    document.getElementById('z5SetupClose').onclick=()=>recruitmentV5();root.querySelector('.z5-setup-top button:nth-of-type(2)').onclick=()=>recruitmentV5();root.querySelectorAll('[data-z5-setup]').forEach(b=>b.onclick=()=>renderSetup(b.dataset.z5Setup));
    const sm=document.getElementById('z5SetupMain');
    if(section==='workflows'){
      sm.innerHTML=`<div class="z5-setup-tabs"><button class="active">Rules</button><button>Usage</button></div><div class="z5-setup-content"><h1>Workflow Rules</h1><p>Workflow rules automate actions on CRM records based on filter criteria.</p><div class="z5-setup-actions"><label>⌕ <input placeholder="Search"></label><span></span><a>Zia Workflow Creation using Zia</a><button class="z5-primary">Create Rule</button></div><div class="z5-setup-table"><table><thead><tr><th><input type="checkbox"></th><th>Rule Name</th><th>Module</th><th>Execute On</th><th>Actions</th><th>Modified On</th><th>Status</th></tr></thead><tbody>${workflowRules.map(r=>`<tr><td><input type="checkbox"></td><td><a>${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><span class="z5-toggle ${r[5]?'on':''}"></span></td></tr>`).join('')}</tbody></table></div></div>`;
    }else if(section==='schedules'){
      sm.innerHTML=`<div class="z5-setup-content"><h1>Schedules</h1><p>Schedules run customizable functions automatically and can integrate CRM data with connected services.</p><div class="z5-pilltabs"><button class="active">Schedules</button><button>Failures</button></div><div class="z5-setup-actions"><label>⌕ <input placeholder="Search"></label><span></span><button class="z5-primary">Create New Schedule</button></div><div class="z5-setup-table"><table><thead><tr><th>Schedule Name</th><th>Last Run</th><th>Next Run</th><th>Frequency</th><th>Status</th></tr></thead><tbody>${schedules.map(r=>`<tr><td><a>${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="z5-toggle ${r[4]?'on':''}"></span></td></tr>`).join('')}</tbody></table></div></div>`;
    }else if(section==='functions'){
      if(fnName==='__analytics__')renderGlobalFunctionAnalytics(sm);
      else if(fnName)renderFunctionDetail(sm,fnName,fnTab);
      else renderFunctionsList(sm);
    }
  }
  function renderFunctionsList(sm){
    sm.innerHTML=`<div class="z5-setup-tabs"><button class="active">Functions</button><button>Gallery</button><button id="z5FunctionAnalytics">Analytics</button><button>Failures</button></div><div class="z5-setup-content"><p>Listed below are the functions available for your organization. These functions can be associated to the various features only from the respective places.</p><div class="z5-setup-actions"><button>All ▾</button><button>Deluge ▾</button><label>⌕ <input placeholder="Search Functions"></label><span></span><button class="z5-primary">＋ Create Function</button></div><div class="z5-setup-table"><table><thead><tr><th>Name</th><th>Category</th><th>REST API</th></tr></thead><tbody>${functionNames.map((n,i)=>`<tr data-z5-function="${escapeHtml(n)}"><td><a>${n}</a> ${i<5?'<em class="z5-associated">Associated</em>':''}</td><td>${i===3?'Button':i===5||i===6||i===7?'Schedule':'Automation'}</td><td></td></tr>`).join('')}</tbody></table></div></div>`;
    sm.querySelectorAll('[data-z5-function]').forEach(r=>r.onclick=()=>renderSetup('functions',r.dataset.z5Function,'overview'));
    document.getElementById('z5FunctionAnalytics').onclick=()=>renderSetup('functions','__analytics__');
  }
  function renderFunctionDetail(sm,name,tab='overview'){
    const logs=actualLogs[name]||actualLogs['Fill Applicant From JobOpening'];
    const tabs=['overview','logs','failures'];
    sm.innerHTML=`<div class="z5-setup-tabs"><button id="z5FunctionsBack">Functions</button><button>Gallery</button><button id="z5GlobalAnalytics">Analytics</button><button>Failures</button></div><div class="z5-setup-content"><div class="z5-function-title"><button id="z5FunctionBack">←</button><h1>${name}</h1><span>Deluge</span></div><p>View the usage stats of your functions, their logs, and analyse the failures.</p><div class="z5-pilltabs">${tabs.map(t=>`<button data-z5-ftab="${t}" class="${tab===t?'active':''}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div><div id="z5FunctionPane"></div></div>`;
    const pane=document.getElementById('z5FunctionPane');
    if(tab==='overview')pane.innerHTML=`<div class="z5-function-overview"><div><strong>${name==='Recruitment Logs - Fill'?'89':'5'}</strong><span>Executions shown</span></div><div><strong>100%</strong><span>Success in visible log sample</span></div><div><strong>Deluge</strong><span>Runtime</span></div></div>`;
    else if(tab==='logs')pane.innerHTML=`<div class="z5-log-filter"><button>Last 30 Days ▾</button><span>Note: Data may take up to 5 minutes to reflect. | Time Zone : (GMT-4:0) Eastern Daylight Time (America/New_York)</span></div><div class="z5-setup-table"><table><thead><tr><th>Requested Time</th><th>Status</th><th>Response</th><th>Duration In Milliseconds</th></tr></thead><tbody>${logs.map(r=>`<tr><td>${r[0]}</td><td>${r[1]} <span class="z5-ok">✓</span></td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
    else if(tab==='failures')pane.innerHTML=`<div class="z5-empty-setup"><b>No failures in the visible evidence sample.</b><span>Failure history would appear here when present.</span></div>`;
    document.getElementById('z5FunctionBack').onclick=()=>renderSetup('functions');
    document.getElementById('z5FunctionsBack').onclick=()=>renderSetup('functions');
    document.getElementById('z5GlobalAnalytics').onclick=()=>renderSetup('functions','__analytics__');
    sm.querySelectorAll('[data-z5-ftab]').forEach(b=>b.onclick=()=>renderSetup('functions',name,b.dataset.z5Ftab));
  }

  function renderGlobalFunctionAnalytics(sm){
    sm.innerHTML=`<div class="z5-setup-tabs"><button id="z5AnalyticsFunctions" class="active">Functions</button><button>Gallery</button><button>Analytics</button><button>Failures</button></div><div class="z5-fa-page">${functionAnalyticsEvidence()}</div>`;
    document.getElementById('z5AnalyticsFunctions').onclick=()=>renderSetup('functions');
  }

  function functionAnalyticsEvidence(){
    const daily=[0,0,18,3,2,0,0,0,0,0,1,7,0,9,11,6,5,0,0,24,0,0,0,0,0,3,0,0,0,0];
    const bars=[18,3,2,0,0,1,7,0,9,11,6,5,0,24,0,3];
    const barDates=['Aug 1','Aug 3','Aug 4','Aug 5','Aug 7','Aug 8','Aug 11','Aug 13','Aug 15','Aug 16','Aug 17','Aug 18','Aug 21','Aug 23','Aug 25','Aug 27'];

    const lineW=1320,lineH=170,left=58,right=22,top=18,bottom=58,plotW=lineW-left-right,plotH=lineH-top-bottom,maxY=26;
    const pts=daily.map((v,i)=>[left+(i/(daily.length-1))*plotW,top+plotH-(v/maxY)*plotH]);
    const successPath=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const failY=top+plotH;
    const yTicks=[0,10,20];
    const xLabels=daily.map((_,i)=>i).filter(i=>i%2===0||i===daily.length-1);
    const lineSvg=`<svg viewBox="0 0 ${lineW} ${lineH}" preserveAspectRatio="xMidYMid meet" aria-label="Success vs Failure Pattern">
      ${yTicks.map(v=>{const y=top+plotH-(v/maxY)*plotH;return `<line x1="${left}" y1="${y}" x2="${lineW-right}" y2="${y}" class="grid"></line><text x="${left-14}" y="${y+4}" text-anchor="end" class="axis-text">${v}</text>`}).join('')}
      <text x="15" y="${top+plotH/2}" transform="rotate(-90 15 ${top+plotH/2})" text-anchor="middle" class="axis-title">Number</text>
      <path d="${successPath}" class="success"></path>
      <path d="M${left} ${failY} L${lineW-right} ${failY}" class="failure"></path>
      ${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.7" class="success-dot"></circle><circle cx="${p[0]}" cy="${failY}" r="3.4" class="failure-dot"></circle>`).join('')}
      ${xLabels.map(i=>{const x=left+(i/(daily.length-1))*plotW;return `<text x="${x}" y="${lineH-31}" transform="rotate(45 ${x} ${lineH-31})" class="axis-text date">Aug ${i+1}, 2026</text>`}).join('')}
      <text x="${left+plotW/2}" y="${lineH-7}" text-anchor="middle" class="axis-title">Function Execution Date</text>
    </svg>`;

    const barW=650,barH=270,bl=48,br=12,bt=18,bb=66,bpw=barW-bl-br,bph=barH-bt-bb,bmax=26;
    const slot=bpw/bars.length,barWidth=Math.min(18,slot*.56);
    const barSvg=`<svg viewBox="0 0 ${barW} ${barH}" aria-label="Function Execution Chart">
      ${[0,2,4,6,8,10,12,14,16,18,20,22,24,26].map(v=>{const y=bt+bph-(v/bmax)*bph;return `<line x1="${bl}" y1="${y}" x2="${barW-br}" y2="${y}" class="grid"></line><text x="${bl-9}" y="${y+3}" text-anchor="end" class="axis-text">${v}</text>`}).join('')}
      <text x="13" y="${bt+bph/2}" transform="rotate(-90 13 ${bt+bph/2})" text-anchor="middle" class="axis-title">Credits Used</text>
      ${bars.map((v,i)=>{const x=bl+i*slot+(slot-barWidth)/2;const h=(v/bmax)*bph;const y=bt+bph-h;return `${v?`<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" class="bar"></rect><text x="${x+barWidth/2}" y="${Math.max(bt+9,y-5)}" text-anchor="middle" class="bar-value">${v}</text>`:''}<text x="${x+barWidth/2}" y="${barH-46}" transform="rotate(45 ${x+barWidth/2} ${barH-46})" class="axis-text date">${barDates[i]}, 2026</text>`}).join('')}
      <text x="${bl+bpw/2}" y="${barH-4}" text-anchor="middle" class="axis-title">Function Execution Date</text>
    </svg>`;

    return `<div class="z5-fa-kpis">
      <div class="z5-fa-exec-card"><div class="z5-fa-card-title">Executions</div><div class="z5-fa-exec-pair"><div><strong>89</strong><span>Success</span></div><div><strong>0</strong><span>Failures</span></div></div></div>
      <div class="z5-fa-credit-card"><strong>89</strong><span>Credits Used</span></div>
    </div>
    <section class="z5-fa-chart z5-fa-line-card"><h3>Success Vs Failure Pattern</h3><div class="z5-fa-line">${lineSvg}<div class="z5-fa-legend"><span><i class="green"></i>Success</span><span><i class="red"></i>Failure</span></div></div></section>
    <div class="z5-fa-grid">
      <section class="z5-fa-chart"><h3>Function Execution Chart</h3><div class="z5-fa-bar-svg">${barSvg}</div></section>
      <section class="z5-fa-chart"><h3>Top Integration Tasks</h3><div class="z5-fa-pie-svg"><svg viewBox="0 0 620 270" aria-label="Top Integration Tasks">
        <path d="M310 35 A100 100 0 1 1 216.1 169.2 L310 135 Z" fill="#19bdd3"></path>
        <path d="M216.1 169.2 A100 100 0 0 1 310 35 L310 135 Z" fill="#ffa436"></path>
        <polyline points="215,82 180,82 156,70" fill="none" stroke="#8f99a7" stroke-width="1"></polyline>
        <text x="152" y="68" text-anchor="end" class="pie-label">Update Record: 89</text>
        <polyline points="405,172 444,172 466,185" fill="none" stroke="#8f99a7" stroke-width="1"></polyline>
        <text x="470" y="188" class="pie-label">Get Record By ID: 196</text>
      </svg><div class="z5-fa-pie-legend"><span><i class="cyan"></i>Get Record By ID</span><span><i class="orange"></i>Update Record</span></div></div></section>
    </div>`;
  }

  function renderModule(){
    if(state.module==='Applicants')return renderApplicants();
    if(state.module==='Employees')return renderEmployees();
    if(state.module==='Job Openings')return renderJobs();
    if(state.module==='Facilities')return renderFacilities();
    if(state.module==='Recruitment Report Center')return renderReportCenter();
    if(state.module==='Recruiter Activity Reports')return renderRecruiterActivityReports();
    if(state.module==='Tasks')return simpleList('Tasks',['Subject','Owner','Due Date','Status'],[['Review AI screening exceptions','Recruiter A','Today','In Progress'],['Confirm candidate availability','Recruiter B','Today','Open'],['Validate facility lookup mapping','CRM Admin','Tomorrow','Open'],['Reprocess failed application','Automation','Today','Completed']],'Create Task');
    if(state.module==='Meetings')return simpleList('Meetings',['Meeting','Facility','Time','Provider','Status'],[['Emily Carter — RN Interview','North Harbor Care','Sep 1 · 10:00 AM','Teams','Confirmed'],['Shivani Patel — CNA Interview','Riverside Health','Sep 2 · 2:30 PM','Zoom','Confirmed'],['Calvin Brooks — RRT Interview','Greenfield Care','Sep 3 · 11:00 AM','Teams','Pending']],'Create Meeting');
    if(state.module==='Calls')return simpleList('Calls',['Contact','Direction','Owner','Duration','Status'],[['Emily Carter','Outbound','Recruiter A','2m 18s','Completed'],['Calvin Brooks','Outbound','Recruiter B','No answer','Follow-up'],['Hannah Irving','Inbound','Recruiter A','4m 02s','Completed']],'Log a Call');
    if(state.module==='Services')return simpleList('Services',['Service','Category','Owner','Status'],[['AI Resume Screening','Automation','Automation Team','Active'],['Interview Scheduling','Recruitment','Recruitment Ops','Active'],['CRM Migration Support','Data','CRM Admin','Active']],'Create Service');
    if(state.module==='Projects')return simpleList('Projects',['Project','Owner','Status','Due Date'],[['Recruitment CRM','CRM Admin','Live','Ongoing'],['Reporting Upgrade','Analytics','In Progress','Sep 15, 2026'],['Hiring Manager Portal','Solutions','Validation','Sep 30, 2026']],'Create Project');
  }

  moduleButtons.forEach(b=>b.onclick=()=>setModule(b.dataset.z5Module));
  document.querySelectorAll('[data-z5-top]').forEach(b=>b.onclick=()=>{
    const tab=b.dataset.z5Top;
    if(tab==='Reports')return renderNativeReports();
    if(tab==='Analytics')return renderDashboard('Analytics');
    if(tab==='Home')return renderDashboard('Home');
    if(tab==='Workqueue')return renderWorkqueue('tasks');
    if(tab==='Agents'){setTopActive('Agents');moduleButtons.forEach(x=>x.classList.remove('active'));main.innerHTML=`<div class="z5-module-title"><h1>Agents</h1></div><div class="z5-home"><section><h3>External automation layer</h3><p>AI screening and integration work is handled by reconstructed n8n orchestration rather than by a CRM-native agent.</p><button class="z5-primary" id="z5OpenN8n">Open n8n Workflow</button></section></div>`;document.getElementById('z5OpenN8n').onclick=()=>toast('Open the n8n workflow from the automation demo');return;}
    setModule('Applicants');
  });
  const settingsButton=root.querySelector('.z5-toptools [title="Settings"]');if(settingsButton)settingsButton.onclick=()=>renderSetup('workflows');
  renderDashboard('Home');
}

