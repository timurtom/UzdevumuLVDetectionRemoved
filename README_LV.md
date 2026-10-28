# Skripts špikošanas aizsardzības noņemšanai

> VĒL NAV PĀRBAUDĪTS!!

[RU](./README.md) | LV | [EN](./README_EN.md)

## Kas tas ir?
Šis ir skripts, kas noņem [aizsardzību pret špikošanu](https://www.youtube.com/watch?v=liw9UnEltU0) tiešsaistes pārbaudes darbos portālā [Uzdevumi.lv](https://uzdevumi.lv), kura nobloķē lapu, kad tiek pārslēgta cilne (tab).


## Kā darbojas šī aizsardzība?

1. Redzamības stāvokļa viltošana (spoofing: `visibilityState` un `hidden`)
Pārlūkprogramma nepārtraukti sūta vietnei notikumus, kad tu pārej uz citu cilni vai samazini logu (īpašības `document.hidden` kļūst `true`, bet `visibilityState` nomainās uz `hidden`).
    - Skripts piespiedu kārtā pārraksta šīs īpašības caur `Object.defineProperty`, stingri liekot pārlūkprogrammai vienmēr atgriezt `false` un `'visible'`. Vietnei tu esi "uz mūžu pielīmēts" cilnei.
    - Papildus skripts nobloķē notikumu pārtvērējus `visibilitychange`, `blur` un `focus`, lai vietne pat nemēģinātu pamanīt fokusa zaudēšanu.

2. Tīkla pieprasījumu atcelšana (`reportAway` / `reportReturn`)
Aizsardzības sistēmai ir iebūvēts objekts `Yk.tabSwitchGuard`, kas atbild par ziņojumu sūtīšanu uz serveri:
   - Funkcija `init` tiek pārtverta darbības laikā.
   - Kad sistēma mēģina inicializēt URL adreses atskaišu sūtīšanai (`reportAway` — aizgāja, `reportReturn` — atgriezās), skripts aizstāj tās ar `null`, bet parametru `trackingEnabled` iestata uz `false`.
   - Rezultātā, pat ja lapa mēģinās nosūtīt datus uz serveri, pieprasījumi nekur neaizies — serveris paliks pilnīgā neziņā.

3. Automātiskais saskarnes tīrītājs (`MutationObserver`)
Ja lapā tomēr nostrādā kāds lokālais skripts un mēģina parādīt paziņojumu ar brīdinājumu vai nobloķēt ekrānu (`#antiCheatTabSwitchWarning` vai `#antiCheatTabSwitchLock`):

    - Tiek ieslēgts `MutationObserver` — tas ir sargs, kas reāllaikā seko līdzi izmaiņām lapas HTML kokā.
    - Tiklīdz pretšpikošanas sistēma mēģina ievietot bloķētāju vai brīdinājumu DOM struktūrā, skripts to momentāni izdzēš, pirms tu vispār spēj to ieraudzīt.

## Kā palaist?

1. Atver vajadzīgo testu vai pārbaudes darbu vietnē [Uzdevumi.lv](https://uzdevumi.lv).
2. Nospied taustiņu **`F12`** (vai uzklikšķini ar labo peles pogu jebkurā lapas vietā -> **«Pārbaudīt» / Inspect**), lai atvērtu izstrādātāja rīkus.
3. Pārej uz cilni **Console** (Konsole).
4. Ieraksti **allow pasting** un nospied **`Enter`**.
5. Pēc tam nokopē faila [`bypass.js`](./bypass.js) saturu no šīs repozitorija, ielīmē to konsolē un nospied **`Enter`**:
