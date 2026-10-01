export const SUPPORTED_LOCALES=Object.freeze(['th','en']);

export const I18N=Object.freeze({
  th:{
    nav:{overview:'ภาพรวม',daily:'รายวัน',person:'รายบุคคล',month:'รายเดือน',analytics:'ข้อมูล',home:'หน้าหลัก',stats:'สถิติ'},
    common:{day:'เวรกลางวัน',night:'เวรกลางคืน',off:'พัก / ไม่เข้าทำงาน',coverage:'กำลังคน',previous:'วันก่อน',next:'วันถัดไป',employee:'พนักงาน',none:'ไม่มี',stable:'ปกติ',watch:'เฝ้าระวัง',critical:'วิกฤต',signals:'สัญญาณ',open:'เปิด',close:'ปิด'},
    loader:{booting:'กำลังเริ่มระบบ',core:'เตรียมระบบหลัก',matrix:'ตรวจสอบตารางเวร',grid:'เชื่อมต่อ Command Grid',interface:'เตรียมหน้าจอ',ready:'พร้อมใช้งาน'},
    daily:{title:'ภาพรวมปฏิบัติการรายวัน',adjacent:'เทียบวันข้างเคียง',transitions:'การเปลี่ยนเวร',risk:'ความเสี่ยงกำลังคน',streaks:'การทำงานต่อเนื่อง',noTransitions:'ไม่มีการเปลี่ยนสถานะไปวันถัดไป',workStreak:'ทำงานต่อเนื่อง {count} วัน',nightStreak:'เวรกลางคืนต่อเนื่อง {count} คืน'},
    risk:{lowStaffing:'เข้าเวร {working} คน',lowNight:'เวร N {night} คน',imbalance:'D {day} / N {night}',highOff:'OFF {off} คน',workStreak:'{name} ทำงานต่อเนื่อง {days} วัน',nightStreak:'{name} เวร N ต่อเนื่อง {nights} คืน',allClear:'ไม่พบสัญญาณเสี่ยงตามเกณฑ์'},
    network:{title:'ความสัมพันธ์ของทีม',sameShift:'ร่วมกะ {count} คน',same:'ร่วมกะ {count}',top:'เพื่อนร่วมทีมเด่น',strength:'ความแข็งแรง',handoff:'ส่งต่องาน',relations:'ความสัมพันธ์'},
    analytics:{title:'สมดุลภาระงานของทีม',avgWork:'เฉลี่ยวันทำงาน',avgNight:'เฉลี่ยเวร N',highest:'สูงสุด',lowest:'ต่ำสุด',workload:'ภาระงาน',delta:'ต่างจากค่าเฉลี่ย'},
    person:{title:'ข้อมูลรายบุคคล',schedule:'ตารางเวร',workDays:'วันทำงาน',nightDays:'เวรกลางคืน',offDays:'วันหยุด'},
    month:{title:'ตารางเวรรายเดือน',matrix:'เมทริกซ์เดือน',october:'ตุลาคม 2569'},
    palette:{placeholder:'ค้นหา วันที่ / ชื่อ / night / off / analytics',empty:'พิมพ์วันที่ ชื่อพนักงาน หรือชื่อหน้า',choose:'เลือก',open:'เปิด',dayLabel:'วันที่ {day} ตุลาคม'},
    mobile:{summary:'สรุปรายวัน'},
    modes:{label:'โหมดกราฟิก',high:'สูง',balanced:'สมดุล',eco:'ประหยัด'},
    accessibility:{language:'ภาษา',performance:'โหมดประสิทธิภาพ',commandPalette:'Command Palette'}
  },
  en:{
    nav:{overview:'Overview',daily:'Daily',person:'Person',month:'Month',analytics:'Analytics',home:'Home',stats:'Stats'},
    common:{day:'Day Shift',night:'Night Shift',off:'Off Duty',coverage:'Coverage',previous:'Previous Day',next:'Next Day',employee:'Employee',none:'None',stable:'Stable',watch:'Watch',critical:'Critical',signals:'Signals',open:'Open',close:'Close'},
    loader:{booting:'Booting',core:'Initializing Core Systems',matrix:'Verifying Shift Matrix',grid:'Linking Command Grid',interface:'Rendering Interface',ready:'Ready'},
    daily:{title:'Daily Operations Overview',adjacent:'Adjacent Days',transitions:'Shift Transitions',risk:'Staffing Risk',streaks:'Current Streaks',noTransitions:'No status changes into the next day',workStreak:'{count}-day work streak',nightStreak:'{count}-night N streak'},
    risk:{lowStaffing:'{working} staff on duty',lowNight:'{night} staff on N shift',imbalance:'D {day} / N {night}',highOff:'{off} staff OFF',workStreak:'{name} — {days}-day work streak',nightStreak:'{name} — {nights}-night N streak',allClear:'No staffing risk signals at current thresholds'},
    network:{title:'Team Network',sameShift:'{count} teammates on the same shift',same:'Same shift {count}',top:'Top Teammate',strength:'Strength',handoff:'Handoff',relations:'Relations'},
    analytics:{title:'Team Workload Balance',avgWork:'Avg Work',avgNight:'Avg N',highest:'Highest',lowest:'Lowest',workload:'Workload',delta:'Delta vs Avg'},
    person:{title:'Personnel Detail',schedule:'Shift Schedule',workDays:'Work Days',nightDays:'Night Shifts',offDays:'Off Days'},
    month:{title:'Monthly Shift Schedule',matrix:'Month Matrix',october:'October 2026'},
    palette:{placeholder:'Search date / name / night / off / analytics',empty:'Type a date, employee name, or view name',choose:'Select',open:'Open',dayLabel:'{day} October'},
    mobile:{summary:'Daily Summary'},
    modes:{label:'Visual Mode',high:'High',balanced:'Balanced',eco:'Eco'},
    accessibility:{language:'Language',performance:'Performance mode',commandPalette:'Command Palette'}
  }
});
