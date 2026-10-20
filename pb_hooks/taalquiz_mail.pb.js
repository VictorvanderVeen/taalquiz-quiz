/// <reference path="../pb_data/types.d.ts" />

// Mailt elke deelnemer van de taalquiz zijn of haar uitslag, via Brevo.
// Staat op de server in /opt/pocketbase/pb_hooks/, naast brevo.key (de API-sleutel, niet in git).
// Zonder brevo.key doet dit niets: de inzending wordt gewoon opgeslagen.

onRecordAfterCreateSuccess((e) => {
  e.next()

  try {
    require(`${__hooks}/taalquiz_mail.js`).verstuur(e.record)
  } catch (err) {
    e.app.logger().error("Taalquiz: mail versturen mislukt", "record", e.record.id, "error", String(err))
  }
}, "pbc_2564414573")
