"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type Round = {
  round: number;
  userVs: string;
  p8Vs: string;
};

export default function Home() {
  const [p8Name, setP8Name] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExtraRounds, setShowExtraRounds] = useState(false);
  const initialRounds: Round[] = [
    { round: 1, userVs: "", p8Vs: "" },
    { round: 2, userVs: "", p8Vs: "" },
    { round: 3, userVs: "", p8Vs: "" },
    { round: 4, userVs: "", p8Vs: "" },
    { round: 5, userVs: "", p8Vs: "" },
    { round: 6, userVs: "", p8Vs: "" },
    { round: 7, userVs: "", p8Vs: "" },
  ];
  const [rounds, setRounds] = useState<Round[]>(initialRounds);

  // Ambil data dari localStorage saat pertama kali load
  useEffect(() => {
    const stored = localStorage.getItem("mcgogoData");
    if (stored) {
      const data = JSON.parse(stored);
      setP8Name(data.p8Name || "");
      setRounds(data.rounds || initialRounds);
    }
  }, []);

  // Simpan data ke localStorage setiap kali p8Name atau rounds berubah
  useEffect(() => {
    localStorage.setItem("mcgogoData", JSON.stringify({ p8Name, rounds }));
  }, [p8Name, rounds]);

  // Fungsi untuk menghitung prediksi berdasarkan input manual
  const computePredictions = (p8Name: string, rounds: Round[]): Round[] => {
    const newRounds = rounds.map((r) => ({ ...r }));

    // Ronde 1: otomatis
    newRounds[0].userVs = p8Name;
    newRounds[0].p8Vs = "user";

    // Ronde 3: otomatis, berdasarkan input ronde 2
    if (newRounds[1].userVs !== "" || newRounds[1].p8Vs !== "") {
      newRounds[2].userVs = newRounds[1].p8Vs;
      newRounds[2].p8Vs = newRounds[1].userVs;
    }

    // Ronde 5: otomatis, userVs diambil dari ronde 4 (kolom p8Vs)
    if (newRounds[3].p8Vs !== "") {
      newRounds[4].userVs = newRounds[3].p8Vs;
      // newRounds[4].p8Vs tetap diisi manual (placeholder dinamis khusus)
    }

    // Ronde 6: otomatis, userVs diambil dari ronde 5 (kolom p8Vs)
    if (newRounds[4].p8Vs !== "") {
      newRounds[5].userVs = newRounds[4].p8Vs;
      // newRounds[5].p8Vs diisi manual (misal: p6)
    }

    // Ronde 7: otomatis,
    // userVs diambil dari ronde 6 (kolom p8Vs),
    // dan p8Vs diisi dengan nilai userVs di ronde 6 (lawan user di ronde 6)
    if (newRounds[5].userVs !== "" && newRounds[5].p8Vs !== "") {
      newRounds[6].userVs = newRounds[5].p8Vs;
      newRounds[6].p8Vs = newRounds[5].userVs;
    }

    return newRounds;
  };

  // Update state saat input berubah dan re-run prediksi
  const handleRoundChange = (
    index: number,
    field: "userVs" | "p8Vs",
    value: string
  ) => {
    const newRounds = rounds.map((r) => ({ ...r }));
    newRounds[index][field] = value;
    const updatedRounds = computePredictions(p8Name, newRounds);
    setRounds(updatedRounds);
  };

  // Update global p8Name dan re-run prediksi
  const handleP8NameChange = (value: string) => {
    setP8Name(value);
    const updatedRounds = computePredictions(value, rounds);
    setRounds(updatedRounds);
  };

  // Reset: hapus data dan kembalikan ke kondisi awal
  const resetGame = () => {
    setP8Name("");
    setRounds(initialRounds);
    localStorage.removeItem("mcgogoData");
  };

  // Menentukan apakah suatu kolom di ronde tertentu dihasilkan otomatis
  const isAuto = (round: number, field: "userVs" | "p8Vs"): boolean => {
    if (round === 1) return true;
    if (round === 3) return true;
    if (round === 5 && field === "userVs") return true;
    if (round === 6 && field === "userVs") return true;
    if (round === 7) return true; // kedua kolom di ronde 7 otomatis
    return false;
  };

  // Placeholder khusus untuk field "p8Vs":
  // - Ronde 5: jika ronde 3 sudah terisi, placeholder = "[nilai ronde3.userVs] vs ", jika belum, tampilkan "musuh kamu di ronde 3 vs ..."
  // - Untuk ronde 2, 4, 6, dan 7: gunakan nilai p8Name jika ada (dengan akhiran " vs"), default "p8 vs"
  const getPlaceholder = (
    round: number,
    field: "userVs" | "p8Vs"
  ): string => {
    if (field === "p8Vs") {
      if (round === 5) {
        return rounds[2]?.userVs
          ? `${rounds[2].userVs} vs `
          : "musuh kamu di ronde 3 vs ...";
      } else {
        return p8Name ? `${p8Name} vs` : "p8 vs";
      }
    }
    return "";
  };

  return (
    <div className="container my-4">
      {/* Header & Reset Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">MCGoGo Enemy Predictor by Afidz</h2>
        <button className="btn btn-danger" onClick={resetGame}>
          Reset
        </button>
      </div>

      {/* Subjudul */}
      <div className="mb-3">
        <p className="text-muted">
          Dibuat dengan rumus dari YT Alphine dengan bantuan ChatGPT
        </p>
      </div>

      {/* Toggle Instructions */}
      <div className="mb-3">
        <button
          className="btn btn-secondary mb-2"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </button>
        {showInstructions && (
          <div className="alert alert-info">
            <p>
              <strong>p8</strong> adalah musuh pertama atau mantan pertama. Masukkan
              nama <strong>p8</strong> di bawah, lalu isilah input manual untuk ronde
              2, 4, 5 (p8Vs), dan 6 (p8Vs). Prediksi akan terupdate otomatis berdasarkan aturan:
            </p>
            <ul>
              <li>Ronde 1: User vs = p8, p8Vs = "user"</li>
              <li>Ronde 3: Terprediksi dari ronde 2</li>
              <li>
                Ronde 5: User vs = ronde 4 (p8Vs) → p8Vs diisi manual (placeholder dinamis khusus)
              </li>
              <li>
                Ronde 6: User vs = ronde 5 (p8Vs) → p8Vs diisi manual (misal: p6)
              </li>
              <li>
                Ronde 7: User vs = ronde 6 (p8Vs) dan p8Vs = lawan user di ronde 6
              </li>
              <li>
                <strong>Tabel tambahan:</strong> Tabel ronde 8–14 merupakan salinan
                isian ronde 1–7 dengan nomor ronde di-offset (8 = ronde 1, 9 = ronde 2, dst). Tabel
                ini hanya bersifat read-only.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Input Global untuk p8 */}
      <div className="mb-3">
        <label className="form-label">
          Masukkan nama p8 (musuh pertama/mantan pertama):
        </label>
        <input
          type="text"
          className="form-control"
          value={p8Name}
          onChange={(e) => handleP8NameChange(e.target.value)}
          placeholder="Contoh: P8"
        />
      </div>

      {/* Tabel Ronde 1-7 */}
      <table className="table table-bordered table-responsive">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>User vs</th>
            <th>{p8Name ? `${p8Name} vs` : "p8 vs"}</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((r, idx) => (
            <tr key={r.round}>
              <td>
                <strong>{r.round}</strong>
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={r.userVs}
                  onChange={(e) =>
                    handleRoundChange(idx, "userVs", e.target.value)
                  }
                  placeholder="User vs"
                  readOnly={isAuto(r.round, "userVs")}
                  style={
                    isAuto(r.round, "userVs")
                      ? { backgroundColor: "#e9ecef" }
                      : {}
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={r.p8Vs}
                  onChange={(e) =>
                    handleRoundChange(idx, "p8Vs", e.target.value)
                  }
                  placeholder={getPlaceholder(r.round, "p8Vs")}
                  readOnly={isAuto(r.round, "p8Vs")}
                  style={
                    isAuto(r.round, "p8Vs")
                      ? { backgroundColor: "#e9ecef" }
                      : {}
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Garis pemisah */}
      <hr />

      {/* Toggle untuk menampilkan tabel Ronde 8-14 */}
      <div className="mb-3 text-center">
        <button
          className="btn btn-secondary"
          onClick={() => setShowExtraRounds(!showExtraRounds)}
        >
          {showExtraRounds ? "Sembunyikan ronde 8-14" : "Tampilkan ronde 8-14"}
        </button>
      </div>

      {/* Tabel Ronde 8-14 (read-only, salinan dari ronde 1-7) */}
      {showExtraRounds && (
        <table className="table table-bordered table-responsive">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>User vs</th>
              <th>{p8Name ? `${p8Name} vs` : "p8 vs"}</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, idx) => (
              <tr key={r.round}>
                <td>
                  <strong>{idx + 8}</strong>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={r.userVs}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={r.p8Vs}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer */}
      <footer className="text-center mt-4">
        <small>Copyright by Afidz x ChatGPT 03-mini-high 2025</small>
      </footer>
    </div>
  );
}
