// CÁLCULO (Port fiel del VBA / HTML original)

export function calcPotencia(dias: number, pp1: number, ppp1: number, pp2: number, ppp2: number) {
  return dias * (pp1 * ppp1 + pp2 * ppp2) / 365;
}

export function calcEnergia(kp1: number, ep1: number, kp2: number, ep2: number, kp3: number, ep3: number) {
  return (ep1 * kp1 + ep2 * kp2 + ep3 * kp3) / 100;
}

export function calcPeajes(kp1: number, kp2: number, kp3: number, peajesConfig: any) {
  return (kp1 * peajesConfig.peajeP1 + kp2 * peajesConfig.peajeP2 + kp3 * peajesConfig.peajeP3) / 100;
}

export function calcBonoSocial(bs_dia: number, dias: number) {
  return bs_dia * dias;
}

export function calcValorExcedentes(kwh_exc: number, precio_exc: number) {
  return (kwh_exc * precio_exc) / 100;
}

export function calcIE(P: number, En: number, valExc: number, totalKwh: number, ie_pct: number, bs: number) {
  const valEn = Math.max(0, En - valExc);
  const iePorBase = (P + valEn) * ie_pct / 100;
  const iePorConsumo = totalKwh * 0.001;
  return Math.max(iePorBase, iePorConsumo);
}

export function calcAutoconsumo(kp1: number, kp2: number, kp3: number, excOProduccion: number, fraccion: number) {
  if (fraccion <= 0 || fraccion > 1) return { kp1, kp2, kp3, exc: excOProduccion };
  const ac1 = kp1 * fraccion, ac2 = kp2 * fraccion, ac3 = kp3 * fraccion;
  const totalAC = ac1 + ac2 + ac3;
  const prod = excOProduccion;
  if (totalAC > prod) {
    return {
      kp1: kp1 - (prod * 40) / 168,
      kp2: kp2 - (prod * 40) / 168,
      kp3: kp3 - (prod * 88) / 168,
      exc: 0
    };
  } else {
    return { kp1: kp1 - ac1, kp2: kp2 - ac2, kp3: kp3 - ac3, exc: prod - totalAC };
  }
}

export function calcFactura(tarifa: any, periodo: any, glob: any, costs: any) {
  let { kp1, kp2, kp3, exc } = calcAutoconsumo(
    +periodo.kp1, +periodo.kp2, +periodo.kp3,
    +periodo.exc, +glob.autoconsumoEstimado
  );
  if (+glob.autoconsumoEstimado <= 0) exc = +periodo.exc;

  const dias = +periodo.dias;
  const totalKwh = kp1 + kp2 + kp3;

  const P = calcPotencia(dias, +periodo.pp1, +tarifa.potP1Punta, +periodo.pp2, +tarifa.potP2Valle);
  const P_BOE = calcPotencia(dias, +periodo.pp1, +costs.potBoeP1, +periodo.pp2, +costs.potBoeP2);
  const En = calcEnergia(kp1, +tarifa.energiaP1Punta, kp2, +tarifa.energiaP2Llana, kp3, +tarifa.energiaP3Valle);
  
  const peajesConfig = {
    peajeP1: +costs.peajeP1, peajeP2: +costs.peajeP2, peajeP3: +costs.peajeP3
  };
  const peajes = calcPeajes(kp1, kp2, kp3, peajesConfig);
  const valExc = calcValorExcedentes(exc, +tarifa.excedentes);
  const bs = calcBonoSocial(+glob.bonoSocialDia, dias);
  const ie = calcIE(P, En, valExc, totalKwh, +costs.impuestoElectrico, bs);
  const alq = +costs.alquilerContadorDia * dias;
  const fbs = (+costs.financiacionBonoSocialDia || 0) * dias;

  const limComp = En;
  const excAEn = Math.min(valExc, limComp);
  const excReg = Math.max(0, valExc - limComp);
  const enFact = Math.max(0, limComp - excAEn);

  const cuota = ((+tarifa.cuotaMensual || 0) * 12 / 365) * dias;

  const base = P + enFact + bs + alq + ie + cuota + fbs;
  const ivaAmt = base * +costs.iva / 100;
  const total = base + ivaAmt;

  return {
    P, P_BOE, En, peajes, valExc, excAEn, excReg, enFact,
    bs, alq, ie, cuota, base, ivaAmt, total, fbs,
    totalKwh, kp1, kp2, kp3, exc, dias,
    margenPot: P - P_BOE
  };
}

export function simularAnual(tarifa: any, consumos: any[], glob: any, costs: any) {
  const meses = consumos.map(c => calcFactura(tarifa, c, glob, costs));
  const totalAnual = meses.reduce((s, m) => s + m.total, 0);
  const totalKwh = meses.reduce((s, m) => s + m.totalKwh, 0);
  return { tarifa, meses, totalAnual, totalKwh, precioMedio: totalAnual / Math.max(1, totalKwh) * 100 };
}
