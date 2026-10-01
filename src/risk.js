import {currentWorkStreak,currentNightStreak} from './cache.js';

export const RISK_THRESHOLDS={LOW_STAFFING:6,LOW_NIGHT_COVERAGE:2,CONSECUTIVE_WORK:3,LONG_NIGHT_STREAK:3,D_N_IMBALANCE:3,HIGH_OFF_COUNT:5};

export function evaluateDayRisk(day,cache,staff){
  const s=cache.dayStats[day],out=[];
  if(s.working<RISK_THRESHOLDS.LOW_STAFFING)out.push({level:'critical',code:'LOW STAFFING',values:{working:s.working},text:`เข้าเวร ${s.working} คน`});
  if(s.N<RISK_THRESHOLDS.LOW_NIGHT_COVERAGE)out.push({level:'warning',code:'LOW NIGHT COVERAGE',values:{night:s.N},text:`เวร N ${s.N} คน`});
  if(Math.abs(s.D-s.N)>=RISK_THRESHOLDS.D_N_IMBALANCE)out.push({level:'warning',code:'D/N IMBALANCE',values:{day:s.D,night:s.N},text:`D ${s.D} / N ${s.N}`});
  if(s.OFF>=RISK_THRESHOLDS.HIGH_OFF_COUNT)out.push({level:'info',code:'HIGH OFF COUNT',values:{off:s.OFF},text:`OFF ${s.OFF} คน`});
  staff.forEach((p,i)=>{
    const w=currentWorkStreak(staff,i,day),n=currentNightStreak(staff,i,day);
    if(w>=RISK_THRESHOLDS.CONSECUTIVE_WORK)out.push({level:'info',code:'WORK STREAK',values:{name:p.name,days:w},text:`${p.name} ${w} วัน`});
    if(n>=RISK_THRESHOLDS.LONG_NIGHT_STREAK)out.push({level:'warning',code:'NIGHT STREAK',values:{name:p.name,nights:n},text:`${p.name} N ${n} คืน`});
  });
  return out;
}
