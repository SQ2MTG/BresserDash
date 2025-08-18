# BresserDash-v4

> Lekki dashboard webowy do wizualizacji danych z stacji pogodowej **Bresser 5-in-1** dekodowanej przez **rtl_433**.

[![Repozytorium](https://img.shields.io/badge/repo-SQ2MTG/BresserDash--v4-blue)](https://github.com/SQ2MTG/BresserDash-v4)
[![Status](https://img.shields.io/badge/status-alpha-yellow)](#)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#license)

---

## O projekcie
**BresserDash-v4** to statyczny frontend (HTML + JavaScript) do wyświetlania bieżących pomiarów i historii odczytów ze stacji **Bresser 5-in-1**. Źródłem danych jest program **rtl_433** (dongle RTL-SDR), który wypisuje rekordy w formacie JSON (zwykle **NDJSON** — każdy wiersz to osobny obiekt JSON). Dashboard wczytuje plik(y) JSON/NDJSON i wizualizuje metryki (temperatura, wilgotność, wiatr, opad, punkt rosy, sygnał).

---

## Najważniejsze cechy
- Statyczny frontend — można hostować na GitHub Pages, Netlify, Vercel itp.
- Zgodność z wyjściem `rtl_433` (NDJSON) — można wskazać plik/endpoint z ostatnim rekordem lub historią.
- Wizualizacje: wykresy czasowe, karta metryk, wind-rose, wskaźniki sygnału i baterii.
- Prosty mechanizm historii (localStorage i opcjonalny `history.json`).

---

## Wymagania
- `rtl_433` (np. Raspberry Pi + RTL-SDR dongle)
- Przeglądarka (HTML + JS)
- (opcjonalnie) serwer HTTP do podania plików (np. `python -m http.server`)

---

## Uruchomienie rtl_433 (przykłady)
Na maszynie z donglem uruchom skrypt, który zapisuje rekordy JSON do pliku (NDJSON):

```bash
# wypisuje JSON na stdout
rtl_433 -F json

# dopisz kolejne rekordy NDJSON do pliku
rtl_433 -F json >> /path/to/history.json

# lub jednocześnie podglądaj i zapisuj:
rtl_433 -F json | tee -a /path/to/history.json
