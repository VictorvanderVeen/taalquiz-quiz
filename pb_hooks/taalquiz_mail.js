// Opbouw en verzending van de uitslagmail. Wordt geladen door taalquiz_mail.pb.js.
// VRAGEN komt uit QUESTIONS in index.html: pas je daar een vraag aan, pas hem hier ook aan.

const AFZENDER = { name: "Stichting Lezen en Schrijven", email: "meedoen@lezenenschrijven.nl" }
const DONEER_URL = "https://doneren.lezenenschrijven.nl/"

const VRAGEN = [
  {
    "fout": "annemonen",
    "uitleg": "annemonen → dit moet zijn: anemonen.",
    "regel": "Anemoon schrijf je met één n na de a. Het woord komt van het Griekse <em>anemos</em>, wind."
  },
  {
    "fout": "tijd rekken",
    "uitleg": "tijd rekken → dit moet zijn: tijdrekken.",
    "regel": "Een zelfstandig naamwoord en een werkwoord die samen één begrip vormen, schrijf je aan elkaar. Net als bij <em>stofzuigen</em>."
  },
  {
    "fout": "up to date",
    "uitleg": "up to date → dit moet zijn: up-to-date.",
    "regel": "Deze Engelse uitdrukking krijgt in het Nederlands altijd koppeltekens, ook achter het werkwoord."
  },
  {
    "fout": "arondissement",
    "uitleg": "arondissement → dit moet zijn: arrondissement.",
    "regel": "Het woord komt uit het Frans en houdt daarom de dubbele r."
  },
  {
    "fout": "communicatie-apparatuur",
    "uitleg": "communicatie-apparatuur → dit moet zijn: communicatieapparatuur.",
    "regel": "Samenstellingen schrijf je aan elkaar. Een koppelteken zet je alleen als de klinkers op de grens samen als één klank gelezen kunnen worden, zoals in <em>zee-egel</em>. Bij e + a is dat niet zo."
  },
  {
    "fout": "woonwerkverkeer",
    "uitleg": "woonwerkverkeer → dit moet zijn: woon-werkverkeer (met koppelteken).",
    "regel": "Wonen en werken zijn gelijkwaardige delen. Tussen zulke delen zet je een koppelteken, net als in <em>zuid-noordverbinding</em>."
  },
  {
    "fout": "F16-piloot",
    "uitleg": "F16-piloot → dit moet zijn: F-16-piloot.",
    "regel": "Het vliegtuigtype heet F-16, met koppelteken. Maak je er een samenstelling van, dan komt er nog een koppelteken bij."
  },
  {
    "fout": "gecoached",
    "uitleg": "gecoached → dit moet zijn: gecoacht.",
    "regel": "Engelse werkwoorden vervoeg je als Nederlandse. De stam <em>coach</em> eindigt op een stemloze klank (tsj), dus volgens 't kofschip krijgt het voltooid deelwoord een t."
  },
  {
    "fout": "ten alle tijden",
    "uitleg": "ten alle tijden → dit moet zijn: te allen tijde.",
    "regel": "Dit is een vaste uitdrukking met een oude naamval. <em>Ten alle tijden</em> is een veelgemaakte mengvorm."
  },
  {
    "fout": "aflassen",
    "uitleg": "aflassen → dit moet zijn: afgelasten.",
    "regel": "Het werkwoord is <em>gelasten</em> (bevelen) met <em>af</em> ervoor. <em>Lassen</em> is metaal aan elkaar smelten."
  }
]

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, "")
}

// Dezelfde zinnen als het eindscherm van de quiz vroeger gaf
function oordeel(score) {
  if (score === 10) return "Wow, een perfecte score! Je bent een ware taalkenner."
  if (score >= 7) return "Uitstekend gedaan!"
  if (score >= 4) return "Niet slecht, maar er is ruimte voor verbetering!"
  return "Nederlandse spelling is best lastig!"
}

function maakMail(naam, score, antwoorden) {
  const perVraag = {}
  antwoorden.forEach((a) => { perVraag[a.question] = a })

  const blokkenHtml = []
  const blokkenTekst = []
  VRAGEN.forEach((v, i) => {
    const a = perVraag[i + 1] || {}
    const goed = a.correct === true
    const kop = goed ? "✓ Goed" : `✗ Jij koos: ${esc(a.chosen || "-")}`
    const kleur = goed ? "#2E8B57" : "#D32F2F"
    blokkenHtml.push(`
      <tr><td style="padding:0 0 14px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7;border-left:4px solid ${kleur};border-radius:6px">
          <tr><td style="padding:12px 16px;font-size:15px;line-height:1.5;color:#1D1D1B">
            <strong>Vraag ${i + 1}</strong> &nbsp;<span style="color:${kleur};font-weight:600">${kop}</span><br>
            <strong>${esc(v.uitleg)}</strong><br>
            ${v.regel}
          </td></tr>
        </table>
      </td></tr>`)
    blokkenTekst.push(`Vraag ${i + 1}: ${goed ? "goed" : `fout (jij koos: ${a.chosen || "-"})`}\n${v.uitleg}\n${stripHtml(v.regel)}`)
  })

  const groet = naam ? `Hoi ${esc(naam)},` : "Hoi,"
  const cta = "Wil je taal voor iedereen toegankelijk maken? In Nederland heeft 1 op de 5 volwassenen moeite met lezen, schrijven of rekenen. Met jouw bijdrage zorgen we ervoor dat niemand buitengesloten wordt."
  const voet = "Je krijgt deze mail omdat je de taalquiz deed op lezenenschrijven.nl."

  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#FFFFFF;font-family:'Fira Sans',Arial,sans-serif;color:#1D1D1B">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
  <tr><td style="font-size:16px;line-height:1.6;padding:0 0 8px">${groet}</td></tr>
  <tr><td align="center" style="padding:8px 0 16px">
    <div style="display:inline-block;background:#FFF3E8;border-radius:60px;padding:22px 30px;text-align:center">
      <div style="font-size:40px;font-weight:700;color:#E87722;line-height:1">${score}</div>
      <div style="font-size:13px;font-weight:600;color:#D46A1C">van de 10 goed</div>
    </div>
  </td></tr>
  <tr><td style="font-size:16px;line-height:1.6;padding:0 0 20px">${oordeel(score)} Hieronder zie je per vraag welk woord fout was, en waarom.</td></tr>
  ${blokkenHtml.join("")}
  <tr><td style="font-size:15px;line-height:1.55;font-weight:600;padding:12px 0 16px">${cta}</td></tr>
  <tr><td align="center" style="padding:0 0 28px">
    <a href="${DONEER_URL}" style="display:inline-block;background:#E87722;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px">Word donateur</a>
  </td></tr>
  <tr><td style="font-size:12px;line-height:1.5;color:#999999;border-top:1px solid #EEEEEE;padding:14px 0 0">Stichting Lezen en Schrijven<br>${voet}</td></tr>
</table></td></tr></table></body></html>`

  const tekst = `${naam ? `Hoi ${naam},` : "Hoi,"}

Je had ${score} van de 10 goed. ${oordeel(score)}

${blokkenTekst.join("\n\n")}

${cta}
Word donateur: ${DONEER_URL}

Stichting Lezen en Schrijven
${voet}`

  return { onderwerp: `Je uitslag van de taalquiz: ${score} van de 10 goed`, html, tekst }
}

function verstuur(record) {
  let sleutel
  try {
    sleutel = toString($os.readFile(`${__hooks}/brevo.key`)).trim()
  } catch (_) {
    return // Nog geen Brevo-sleutel op de server: niets versturen
  }
  if (!sleutel) return

  const naam = record.getString("voornaam")
  const mail = maakMail(naam, record.getInt("score"), JSON.parse(record.getString("antwoorden") || "[]"))

  const res = $http.send({
    url: "https://api.brevo.com/v3/smtp/email",
    method: "POST",
    headers: { "api-key": sleutel, "content-type": "application/json", "accept": "application/json" },
    body: JSON.stringify({
      sender: AFZENDER,
      to: [{ email: record.getString("email"), name: naam || undefined }],
      subject: mail.onderwerp,
      htmlContent: mail.html,
      textContent: mail.tekst,
      tags: ["taalquiz"],
    }),
    timeout: 20,
  })
  if (res.statusCode >= 300) throw new Error(`Brevo ${res.statusCode}: ${toString(res.body)}`)
}

module.exports = { verstuur, maakMail }
