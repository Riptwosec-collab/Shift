export const I18N=Object.freeze({
  th:{
    nav:{overview:'ภาพรวม',daily:'รายวัน',person:'รายบุคคล',month:'รายเดือน',analytics:'ข้อมูล',home:'หน้าหลัก',stats:'สถิติ'},
    common:{previous:'วันก่อน',next:'วันถัดไป',employee:'พนักงาน',coverage:'ครอบคลุม',work:'ทำงาน',off:'OFF',stable:'ปกติ',watch:'เฝ้าระวัง',critical:'วิกฤต',strength:'ความสัมพันธ์',topTeammate:'เพื่อนร่วมทีมเด่น',signals:'สัญญาณ',none:'ไม่มี'},
    loader:{phase1:'กำลังเริ่มระบบหลัก',phase2:'กำลังตรวจตารางเวร',phase3:'กำลังเชื่อม Command Grid',phase4:'อินเทอร์เฟซพร้อม',starting:'กำลังเริ่ม…',checking:'กำลังตรวจข้อมูล…',linking:'กำลังเชื่อมวิดเจ็ต…',finalizing:'กำลังเตรียมหน้าจอ…',ready:'พร้อมใช้งาน'},
    daily:{title:'ภาพรวมปฏิบัติการรายวัน',adjacent:'วันข้างเคียง',transitions:'การเปลี่ยนเวร',risk:'ความเสี่ยงกำลังคน',streaks:'เวรต่อเนื่อง',noTransition:'ไม่มีการเปลี่ยนสถานะไปวันถัดไป',noRisk:'ไม่พบสัญญาณเสี่ยงตามเกณฑ์',workStreak:'ทำงานต่อเนื่อง {count} วัน',nightStreak:'เวรกลางคืนต่อเนื่อง {count} คืน'},
    risk:{LOW_STAFFING:'กำลังคนต่ำ',LOW_NIGHT_COVERAGE:'เวรกลางคืนต่ำ',D_N_IMBALANCE:'D/N ไม่สมดุล',HIGH_OFF_COUNT:'จำนวน OFF สูง',WORK_STREAK:'ทำงานต่อเนื่อง',NIGHT_STREAK:'เวรกลางคืนต่อเนื่อง'},
    network:{title:'ความสัมพันธ์ของทีม',same:'ร่วมกะ',handoff:'ส่งต่องาน',strength:'ความสัมพันธ์',top:'เพื่อนร่วมทีมเด่น'},
    analytics:{title:'สมดุลภาระงานของทีม',avgWork:'ค่าเฉลี่ยวันทำงาน',avgNight:'ค่าเฉลี่ยเวร N',highest:'สูงสุด',lowest:'ต่ำสุด',personLoad:'ภาระงานรายบุคคล'},
    person:{title:'ข้อมูลรายบุคคล',schedule:'ตารางเวร',workload:'ภาระงาน'},
    month:{title:'ตารางเวรรายเดือน',matrix:'ตารางเดือน'},
    palette:{placeholder:'ค้นหา วันที่ / ชื่อ / night / off / analytics',empty:'พิมพ์วันที่ ชื่อพนักงาน หรือชื่อหน้า',choose:'เลือก',open:'เปิด'},
    mobile:{home:'หน้าหลัก',daily:'รายวัน',person:'บุคคล',month:'เดือน',stats:'สถิติ'},
    modes:{HIGH:'สูง',BALANCED:'สมดุล',ECO:'ประหยัด'},
    accessibility:{language:'เลือกภาษา',visualMode:'โหมดประสิทธิภาพภาพ'},
    date:{october:'ตุลาคม'}
  },
  en:{
    nav:{overview:'Overview',daily:'Daily',person:'Personnel',month:'Monthly',analytics:'Analytics',home:'Home',stats:'Stats'},
    common:{previous:'Previous day',next:'Next day',employee:'Employee',coverage:'Coverage',work:'Work',off:'OFF',stable:'Stable',watch:'Watch',critical:'Critical',strength:'Strength',topTeammate:'Top teammate',signals:'Signals',none:'None'},
    loader:{phase1:'Initializing Core Systems',phase2:'Verifying Shift Matrix',phase3:'Linking Command Grid',phase4:'Interface Ready',starting:'Starting…',checking:'Checking schedule…',linking:'Connecting widgets…',finalizing:'Finalizing command center…',ready:'Ready'},
    daily:{title:'Daily Operations Intelligence',adjacent:'Adjacent Days',transitions:'Shift Transitions',risk:'Staffing Risk',streaks:'Current Streaks',noTransition:'No shift transition to the next day',noRisk:'No staffing risk signals at current thresholds',workStreak:'{count}-day work streak',nightStreak:'{count}-night night-shift streak'},
    risk:{LOW_STAFFING:'Low staffing',LOW_NIGHT_COVERAGE:'Low night coverage',D_N_IMBALANCE:'D/N imbalance',HIGH_OFF_COUNT:'High off count',WORK_STREAK:'Work streak',NIGHT_STREAK:'Night streak'},
    network:{title:'Team Network',same:'Same shift',handoff:'Handoff',strength:'Strength',top:'Top teammate'},
    analytics:{title:'Team Workload Balance',avgWork:'Average work days',avgNight:'Average N shifts',highest:'Highest',lowest:'Lowest',personLoad:'Person Load'},
    person:{title:'Personnel',schedule:'Schedule',workload:'Workload'},
    month:{title:'Monthly Shift Matrix',matrix:'Month Matrix'},
    palette:{placeholder:'Search date / name / night / off / analytics',empty:'Type a date, employee name, status, or view',choose:'Choose',open:'Open'},
    mobile:{home:'Home',daily:'Daily',person:'Person',month:'Month',stats:'Stats'},
    modes:{HIGH:'High',BALANCED:'Balanced',ECO:'Eco'},
    accessibility:{language:'Language',visualMode:'Visual performance mode'},
    date:{october:'October'}
  }
});
