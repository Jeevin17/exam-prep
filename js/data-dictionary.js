// ═══════════════════════════════════════════════════
// DATA DICTIONARY
// ═══════════════════════════════════════════════════
const TOPIC_DATA = [
    { id: 'math', name: 'Mathematical Methods', hrs: 72, badge: '', color: 'var(--accent)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 6 },
    { id: 'cm', name: 'Classical Mechanics', hrs: 80, badge: '', color: 'var(--jam)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 7 },
    { id: 'em', name: 'Electrodynamics & Optics', hrs: 90, badge: 'em', color: 'var(--jest)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 8 },
    { id: 'qm', name: 'Quantum Mechanics', hrs: 115, badge: 'qm', color: 'var(--tifr)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 10 },
    { id: 'sm', name: 'Thermodynamics & Stat Mech', hrs: 90, badge: 'sm', color: 'var(--shared)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 8 },
    { id: 'mp', name: 'Modern & Nuclear Physics', hrs: 45, badge: 'mp', color: 'var(--muted)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 5 },
    { id: 'ss', name: 'Solid State Physics', hrs: 50, badge: 'ss', color: 'var(--accent)', exams: ['JAM', 'JEST', 'TIFR'], difficulty: 6 },
    { id: 'elec', name: 'Electronics', hrs: 45, badge: 'mp', color: 'var(--muted)', exams: ['JAM'], difficulty: 4 },
];

// Topic content templates for Theory Phase (phase-blocks HTML per topic)
const TOPIC_CONTENT = {
    math: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--accent)">~72 hrs total</span></div>
<div><div class="phase-num">Mathematical Methods — Full Coverage</div>
<div class="phase-name">Vector Calc · Linear Algebra · ODEs · PDEs · Complex Analysis · Fourier · Special Functions · Tensors</div></div>
<div class="phase-badge" style="background:rgba(136,192,208,.12);color:var(--accent)">MATH</div>
</div><div class="phase-content">
<div class="phase-desc">Foundation for all other topics. Study first, revisit throughout.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–4<br>Vector Calc</div><div class="week-topics"><strong>Vector Calculus (5 hrs)</strong> — Del operator, gradient, divergence, curl, Stokes theorem, Gauss theorem. Coordinate transformations (spherical, cylindrical). <em>→ 1–2 PYQ on Gauss/Stokes immediately after.</em></div></div>
<div class="week-row"><div class="week-label">Days 5–7<br>Lin. Algebra</div><div class="week-topics"><strong>Linear Algebra (6 hrs)</strong> — Eigenvalue problems, diagonalisation, Hermitian operators, unitary matrices, Gram-Schmidt. Pay extra attention to Hermitian vs unitary distinction — it reappears in QM constantly. <em>→ PYQ: eigenvalue of a given matrix.</em></div></div>
<div class="week-row"><div class="week-label">Days 8–10<br>ODEs + PDEs</div><div class="week-topics"><strong>ODEs (5 hrs) + PDEs (8 hrs)</strong> — Frobenius method is the priority. Power series solutions. Wave equation and heat equation via separation of variables. Boundary conditions (Dirichlet, Neumann). <em>→ PYQ: Frobenius ODE, heat equation with initial conditions.</em></div></div>
<div class="week-row"><div class="week-label">Days 11–15<br>Complex Analysis</div><div class="week-topics"><strong>Complex Analysis (10 hrs)</strong> — Cauchy-Riemann, Cauchy's theorem, residue theorem. Work through at least 8 contour integral examples. Green's functions for Laplace and Helmholtz. <em>→ PYQ: Contour integral using residue theorem.</em></div></div>
<div class="week-row"><div class="week-label">Days 16–19<br>Fourier + Special Fn</div><div class="week-topics"><strong>Fourier Analysis + Special Functions (13 hrs)</strong> — Fourier series: compute coefficients for square wave, sawtooth. Fourier transform, Parseval. Dirac delta. Special functions: Legendre, Hermite, Bessel. <em>→ PYQ: Expand a function in Legendre series.</em></div></div>
<div class="week-row"><div class="week-label">Days 20–22<br>Tensors + Green</div><div class="week-topics"><strong>Tensor Analysis (8 hrs) + Green's Functions (7 hrs)</strong> — Index notation, metric tensor, rank-2 tensors. Green's function for Poisson/Helmholtz equation. JEST/TIFR only but must not be skipped. <em>→ PYQ: Maxwell stress tensor in index notation (TIFR).</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~72 hrs</span></div>
<div class="meta-item">Topics closed: <span>Math Physics fully closed ✓</span></div>
</div>
</div></div>`,

    cm: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--accent)">~80 hrs total</span></div>
<div><div class="phase-num">Classical Mechanics — Full Coverage</div>
<div class="phase-name">Lagrangian · Hamiltonian · H-J · Central Force · Rigid Body · Oscillations · Special Relativity</div></div>
<div class="phase-badge" style="background:rgba(94,129,172,.12);color:var(--jam)">CM</div>
</div><div class="phase-content">
<div class="phase-desc">Analytical mechanics forms the backbone of JEST/TIFR. TIFR goes to Goldstein depth.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–4<br>Lagrangian</div><div class="week-topics"><strong>Lagrangian Mechanics (15 hrs)</strong> — Generalised coordinates, constraints (holonomic/non-holonomic), D'Alembert's principle, Euler-Lagrange equations. Write Lagrangians for: pendulum, Atwood machine, particle on rotating hoop, bead on parabolic wire, double pendulum. <em>→ PYQ: Euler-Lagrange for given system (JAM, JEST).</em></div></div>
<div class="week-row"><div class="week-label">Days 5–8<br>Hamiltonian</div><div class="week-topics"><strong>Hamiltonian Mechanics (15 hrs)</strong> — Legendre transform, Hamilton's equations. Phase space, Liouville's theorem. Poisson brackets. Conservation laws from symmetry (Noether). Canonical transformations. Hamilton-Jacobi equation. <em>→ PYQ: Poisson bracket identities, canonical transformation.</em></div></div>
<div class="week-row"><div class="week-label">Days 9–11<br>Central Force</div><div class="week-topics"><strong>Central Force + Kepler (12 hrs)</strong> — Effective potential, orbit equation. Kepler problem: ellipse derivation, Kepler's laws. Virial theorem. Scattering cross-section, Rutherford formula. <em>→ PYQ: Orbit equation r(θ), virial theorem for gravity (TIFR).</em></div></div>
<div class="week-row"><div class="week-label">Days 12–14<br>Rigid Body</div><div class="week-topics"><strong>Rigid Body + Small Oscillations (15 hrs)</strong> — Euler's equations, inertia tensor, symmetric top precession. Normal modes of coupled oscillators (eigenfrequencies and normal coordinates). <em>→ PYQ: Normal modes of two coupled pendulums.</em></div></div>
<div class="week-row"><div class="week-label">Days 15–16<br>Relativity</div><div class="week-topics"><strong>Special Relativity (10 hrs)</strong> — Lorentz transformations, time dilation, length contraction, relativistic energy-momentum 4-vector. Relativistic kinematics: Q-values, threshold energies. <em>→ PYQ: Relativistic collision kinematics (JEST).</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~80 hrs</span></div>
<div class="meta-item">Topics closed: <span>Classical Mechanics fully closed ✓</span></div>
</div>
</div></div>`,

    em: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--jest)">~90 hrs total</span></div>
<div><div class="phase-num">Electrodynamics & Optics — Full Coverage</div>
<div class="phase-name">Electrostatics · Magnetostatics · Maxwell · EM Waves · Radiation · Waveguides · Optics</div></div>
<div class="phase-badge" style="background:rgba(129,161,193,.12);color:var(--jest)">EM</div>
</div><div class="phase-content">
<div class="phase-desc">Griffiths is the primary textbook. Jackson is supplementary for TIFR only.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–5<br>Electrostatics</div><div class="week-topics"><strong>Electrostatics (20 hrs)</strong> — Gauss's law (integral + differential). Boundary value problems: Laplace/Poisson equation, method of images, separation of variables in spherical coordinates. Multipole expansion. Dielectrics, polarisation, boundary conditions at interfaces. <em>→ PYQ: Method of images — charge near grounded plane.</em></div></div>
<div class="week-row"><div class="week-label">Days 6–9<br>Magnetostatics</div><div class="week-topics"><strong>Magnetostatics + Maxwell's Equations (20 hrs)</strong> — Biot-Savart, Ampère, vector potential. Maxwell's equations in matter: D, H, P, M. Boundary conditions. Displacement current. Faraday's law. EM energy density and Poynting vector. <em>→ PYQ: EM boundary conditions at dielectric interface.</em></div></div>
<div class="week-row"><div class="week-label">Days 10–13<br>EM Waves</div><div class="week-topics"><strong>Electromagnetic Waves + Radiation (20 hrs)</strong> — Plane waves: polarisation (linear, circular, elliptical), Fresnel equations, Brewster's angle, reflection/transmission coefficients. Wave guides: TE/TM modes, cutoff frequencies. Larmor formula, dipole radiation. Retarded potentials concept. <em>→ PYQ: Fresnel reflection, waveguide TE10 cutoff.</em></div></div>
<div class="week-row"><div class="week-label">Days 14–16<br>Optics</div><div class="week-topics"><strong>Optics (15 hrs)</strong> — Geometric optics: mirrors, lenses, aberrations. Wave optics: Young's double slit, Michelson interferometer, coherence. Diffraction: single slit, double slit, circular aperture, Rayleigh criterion. Resolving power. Polarisation: Malus's law, wave plates, optical activity. <em>→ PYQ: Rayleigh criterion for telescope (JAM).</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~90 hrs</span></div>
<div class="meta-item">Topics closed: <span>Electrodynamics & Optics fully closed ✓</span></div>
</div>
</div></div>`,

    qm: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--tifr)">~115 hrs total</span></div>
<div><div class="phase-num">Quantum Mechanics — Full Coverage (Highest Priority)</div>
<div class="phase-name">Schrödinger Eq · Dirac Notation · QHO · Angular Momentum · Hydrogen · Perturbation · WKB · Bell's Inequality</div></div>
<div class="phase-badge" style="background:rgba(191,97,106,.12);color:var(--tifr)">QM</div>
</div><div class="phase-content">
<div class="phase-desc">The most heavily weighted topic across all three exams. Use Griffiths as primary (JAM/JEST), Shankar for formalism (JEST/TIFR), Sakurai for advanced topics (TIFR).</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–3<br>Foundations</div><div class="week-topics"><strong>Wave Mechanics Foundations (10 hrs)</strong> — Schrödinger equation (time-dependent + time-independent). Probability interpretation, normalisation. Expectation values. Particle in a box (1D, 2D, 3D). Potential step and barrier: transmission/reflection coefficients. <em>→ PYQ: Particle in box energy and wavefunction.</em></div></div>
<div class="week-row"><div class="week-label">Days 4–6<br>Dirac Notation</div><div class="week-topics"><strong>Dirac Notation + Operator Formalism (12 hrs)</strong> — Bra-ket notation, Hermitian operators, eigenvalue equations. Uncertainty principle (formal derivation). Commutator algebra. Complete sets of commuting observables (CSCO). Matrix representation of operators. Ehrenfest's theorem. <em>→ PYQ: Prove uncertainty relation from commutator (JEST).</em></div></div>
<div class="week-row"><div class="week-label">Days 7–9<br>QHO</div><div class="week-topics"><strong>Quantum Harmonic Oscillator (15 hrs)</strong> — Algebraic solution: creation/annihilation operators, energy spectrum, wavefunctions in terms of Hermite polynomials. Matrix elements of x and p. Zero-point energy. Coherent states. 3D QHO. Present in 100% of JAM papers. <em>→ PYQ: ⟨x²⟩ in nth eigenstate (JAM), matrix element ⟨n|x|m⟩ (JEST).</em></div></div>
<div class="week-row"><div class="week-label">Days 10–13<br>Ang. Momentum</div><div class="week-topics"><strong>Angular Momentum + Spin (20 hrs)</strong> — L_x, L_y, L_z commutator algebra. Raising/lowering operators. L² and L_z eigenvalues. Spherical harmonics Y_l^m. Spin-½: Pauli matrices, eigenstates of S_x/S_y/S_z. Spinors. Addition of angular momenta: Clebsch-Gordan coefficients. Singlet/triplet states. <em>→ PYQ: Spin-½ composite state decomposition (JEST).</em></div></div>
<div class="week-row"><div class="week-label">Days 14–16<br>Hydrogen</div><div class="week-topics"><strong>Hydrogen Atom (10 hrs)</strong> — 3D Schrödinger in spherical coordinates. Separation into radial and angular parts. Bohr energy levels. Quantum numbers n, l, m_l, m_s. Wavefunctions for 1s, 2s, 2p. Selection rules for electric dipole transitions. Degeneracy counting. Fine structure overview. <em>→ PYQ: ⟨r⟩ for hydrogen 1s state (JAM), degeneracy of n=3 level.</em></div></div>
<div class="week-row"><div class="week-label">Days 17–20<br>Perturbation Theory</div><div class="week-topics"><strong>Perturbation Theory (20 hrs)</strong> — Non-degenerate: first and second order energy and state corrections. Degenerate: diagonalise H' within degenerate subspace. Stark effect, Zeeman effect, hyperfine structure. Time-dependent perturbation: Fermi's golden rule derivation. Adiabatic and sudden approximations. <em>→ PYQ: First-order correction for QHO with λx⁴ perturbation (JAM).</em></div></div>
<div class="week-row"><div class="week-label">Days 21–22<br>WKB + Scattering</div><div class="week-topics"><strong>WKB Approximation (6 hrs) + Scattering Theory (6 hrs)</strong> — WKB: quantisation condition, connection formulae, tunnelling probability (alpha decay model). Born approximation, differential cross-section, optical theorem, partial wave analysis. <em>→ PYQ: WKB tunnelling probability (JEST), Born approximation for Yukawa (TIFR).</em></div></div>
<div class="week-row"><div class="week-label">Days 23–25<br>Identical + Bell</div><div class="week-topics"><strong>Identical Particles (8 hrs) + Bell's Inequality (8 hrs)</strong> — Symmetrisation postulate, Slater determinants, exchange interaction, fermionic vs bosonic systems. Pauli exclusion consequences. Then: EPR argument, hidden variable theories, Bell's theorem derivation, CHSH inequality, GHZ states, no-cloning theorem, quantum teleportation concept. TIFR has asked Bell's theorem in 3 of the last 5 years. <em>→ PYQ: CHSH violation condition (TIFR), Slater determinant for Li atom (JEST).</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~115 hrs</span></div>
<div class="meta-item">Topics closed: <span>Quantum Mechanics fully closed ✓ (including Bell's inequality, WKB, identical particles)</span></div>
</div>
</div></div>`,

    sm: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--shared)">~90 hrs total</span></div>
<div><div class="phase-num">Thermodynamics & Statistical Mechanics — Covered in Problem Phase (Months 5–6)</div>
<div class="phase-name">Laws · Potentials · Canonical/Grand Canonical · Quantum Statistics · BEC · Phase Transitions</div></div>
<div class="phase-badge" style="background:rgba(163,190,140,.12);color:var(--shared)">STAT MECH</div>
</div><div class="phase-content">
<div class="phase-desc">Stat Mech is intentionally deferred to Month 5 (parallel with problem-solving) because it builds on QM. It forms 18% of JEST and 20% of TIFR.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Month 5<br>Week 1–2</div><div class="week-topics"><strong>Thermodynamics (15 hrs)</strong> — Laws (0th–3rd), thermodynamic potentials (U, H, F, G), Maxwell relations, Clausius-Clapeyron, phase transitions, van der Waals gas. <em>→ PYQ: Maxwell relation derivation (JEST), van der Waals critical point (JAM).</em></div></div>
<div class="week-row"><div class="week-label">Month 5<br>Week 3</div><div class="week-topics"><strong>Statistical Mechanics Foundations (20 hrs)</strong> — Microcanonical, canonical, grand canonical ensembles. Partition function Z. Boltzmann distribution. Equipartition. Heat capacity of solids (Einstein, Debye models). <em>→ PYQ: Partition function of 2-level system (TIFR), Fermi energy in metals (JEST).</em></div></div>
<div class="week-row"><div class="week-label">Month 5<br>Week 4</div><div class="week-topics"><strong>Quantum Statistics (20 hrs)</strong> — Density of states in 3D. Bose-Einstein condensation: critical temperature, condensate fraction. Blackbody radiation via Planck distribution (Stefan-Boltzmann derivation). Fermi gas at low T: pressure, specific heat. Grand potential. <em>→ PYQ: BEC critical temperature derivation (TIFR), Stefan-Boltzmann from Planck (JAM).</em></div></div>
<div class="week-row"><div class="week-label">Month 6<br>PYQ Sweep</div><div class="week-topics"><strong>Full Stat Mech PYQ Sweep (15 hrs)</strong> — Solve every Stat Mech PYQ from all 3 exams (last 5 years). Categorise errors. Target 30+ problems solved. <em>→ Stat Mech accounts for 18% of JEST and 20% of TIFR — do not underestimate this sweep.</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~90 hrs</span></div>
<div class="meta-item">Status: <span>Handled in Problem Phase (Months 5–6)</span></div>
</div>
</div></div>`,

    mp: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--muted)">~45 hrs total</span></div>
<div><div class="phase-num">Modern & Nuclear Physics — Final Theory Month (JAM-Specific)</div>
<div class="phase-name">Historical QM · Special Relativity · Nuclear Structure · Radioactivity · Fission/Fusion · Lasers</div></div>
<div class="phase-badge" style="background:rgba(102,112,133,.12);color:var(--muted)">JAM</div>
</div><div class="phase-content">
<div class="phase-desc">JAM-centric topic block (~10% of JAM). Covered in the Final Theory Month in a dedicated, compressed sequence.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–3<br>Historical QM</div><div class="week-topics"><strong>Historical Quantum Mechanics & Atomic Models (5 hrs)</strong> — Bohr model, Franck-Hertz experiment, hydrogen spectrum (Lyman/Balmer/Paschen), X-ray spectra, Moseley's law, vector model of atom. Mostly factual. <em>→ Memorise spectral series limit formulae.</em></div></div>
<div class="week-row"><div class="week-label">Days 4–7<br>Nuclear</div><div class="week-topics"><strong>Nuclear Structure & Radioactivity (17 hrs)</strong> — Nuclear size R=r₀A^(1/3), mass defect, binding energy per nucleon. Liquid drop model, semi-empirical mass formula (SEMF), shell model basics. α/β/γ decay, half-life, activity, secular equilibrium. Q-value calculations, fission and fusion energetics. <em>→ PYQ: SEMF application, Q-value calculation, half-life problems (JAM).</em></div></div>
<div class="week-row"><div class="week-label">Days 8–9<br>Lasers + Detectors</div><div class="week-topics"><strong>Lasers & Nuclear Reactions (10 hrs)</strong> — Einstein A and B coefficients, population inversion, 3-level and 4-level laser schemes, threshold condition. Nuclear reaction types, cross sections, Rutherford scattering. Particle detectors (GM counter, scintillator, semiconductor). <em>→ PYQ: Einstein coefficient ratio, threshold reaction energy (JAM).</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~45 hrs</span></div>
<div class="meta-item">Topics closed: <span>Modern & Nuclear Physics ✓ (Final Theory Month)</span></div>
</div>
</div></div>`,

    ss: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--muted)">~50 hrs total</span></div>
<div><div class="phase-num">Solid State Physics — Final Theory Month (JAM-Specific)</div>
<div class="phase-name">Crystal Structure · X-Ray Diffraction · Lattice Vibrations · Free Electron Model · Band Theory · Semiconductors</div></div>
<div class="phase-badge" style="background:rgba(102,112,133,.12);color:var(--muted)">JAM</div>
</div><div class="phase-content">
<div class="phase-desc">JAM ~5–8% weight. High score potential because questions are formulaic once structure factor and band gap calculations are memorised.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–3<br>Crystal Structure</div><div class="week-topics"><strong>Crystal Structure & X-Ray Diffraction (15 hrs)</strong> — 14 Bravais lattices. BCC/FCC structure: coordination number, packing fraction. Reciprocal lattice, Brillouin zone. Bragg's law applied to X-ray diffraction. Structure factor for BCC/FCC (systematic absence conditions must be instant). Miller indices. <em>→ PYQ: Structure factor for BCC (JAM, appears every 2 years).</em></div></div>
<div class="week-row"><div class="week-label">Days 4–6<br>Phonons</div><div class="week-topics"><strong>Lattice Vibrations & Specific Heat (15 hrs)</strong> — 1D monatomic and diatomic chain: dispersion relations, acoustic vs optical branches, band gap at Brillouin zone boundary. Group and phase velocity. Einstein model: quantised vibrations, specific heat at high and low T. Debye model: T³ law, Debye temperature. <em>→ PYQ: Diatomic chain dispersion (JAM), Debye specific heat limit.</em></div></div>
<div class="week-row"><div class="week-label">Days 7–9<br>Band Theory</div><div class="week-topics"><strong>Free Electron Model + Band Theory (12 hrs)</strong> — Free electron model: Fermi energy derivation, density of states at Fermi level, electronic specific heat (linear in T). Bloch's theorem, nearly-free electron (NFE) model, band gap at zone boundary. Metals vs insulators vs semiconductors. Effective mass. <em>→ PYQ: Fermi energy of free electron metal (JAM), band gap from NFE.</em></div></div>
<div class="week-row"><div class="week-label">Days 10–11<br>Semiconductors</div><div class="week-topics"><strong>Semiconductors (8 hrs)</strong> — Intrinsic carrier concentration: np product, law of mass action. Fermi level position in intrinsic and doped semiconductors. p-n junction: depletion layer, contact potential. Hall effect in metals and semiconductors. <em>→ PYQ: Intrinsic carrier concentration calculation, Hall coefficient sign.</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~50 hrs</span></div>
<div class="meta-item">Topics closed: <span>Solid State Physics ✓ (Final Theory Month)</span></div>
</div>
</div></div>`,

    elec: (d1, d2) => `
<div class="phase-block"><div class="phase-header">
<div class="phase-dates">${d1}<br><span style="font-size:10px;color:var(--muted)">~45 hrs total</span></div>
<div><div class="phase-num">Electronics — Final Theory Month (JAM-Only)</div>
<div class="phase-name">Diodes · BJT Amplifiers · Op-Amps · Digital Logic · ADC/DAC · Oscillators</div></div>
<div class="phase-badge" style="background:rgba(102,112,133,.12);color:var(--muted)">JAM ONLY</div>
</div><div class="phase-content">
<div class="phase-desc">JAM-only topic (~5% weight). High score potential — questions are formulaic. Not tested in JEST or TIFR.</div>
<div class="week-grid">
<div class="week-row"><div class="week-label">Days 1–2<br>Diodes</div><div class="week-topics"><strong>Semiconductor Diodes (8 hrs)</strong> — p-n junction: forward/reverse bias, I-V characteristics, ideal diode equation. Rectifier circuits (half-wave, full-wave, bridge). Zener diode: voltage regulation. Photodiode, LED, solar cell concepts. <em>→ PYQ: Peak inverse voltage in rectifier circuit (JAM).</em></div></div>
<div class="week-row"><div class="week-label">Days 3–5<br>BJT</div><div class="week-topics"><strong>BJT Transistor Amplifiers (12 hrs)</strong> — BJT operation (NPN/PNP), operating regions. DC biasing: voltage divider bias, stability factor. Small-signal equivalent circuit. Common-emitter amplifier: voltage gain (A_v = -g_m R_C), input/output impedance. CE configuration is the most frequently tested. <em>→ PYQ: CE amplifier voltage gain calculation (JAM — appears most years).</em></div></div>
<div class="week-row"><div class="week-label">Days 6–7<br>Op-Amps</div><div class="week-topics"><strong>Operational Amplifiers (10 hrs)</strong> — Ideal op-amp assumptions. Inverting amplifier gain, non-inverting amplifier gain, unity gain buffer. Virtual ground concept. Summing amplifier, difference amplifier, integrator, differentiator circuits. Comparator. <em>→ PYQ: Non-inverting amplifier gain (JAM), integrator output waveform.</em></div></div>
<div class="week-row"><div class="week-label">Days 8–10<br>Digital</div><div class="week-topics"><strong>Digital Logic & ADC/DAC (15 hrs)</strong> — Boolean algebra, De Morgan's theorem, logic gates. Karnaugh maps (up to 4 variables) — simplification technique must be instant. Combinational circuits: adder, multiplexer. Sequential: SR, JK, D flip-flops (truth tables and timing diagrams). Binary counter. ADC resolution, DAC (R-2R ladder). Barkhausen criterion for oscillators. <em>→ PYQ: K-map 4-variable (JAM), JK flip-flop next state (JAM).</em></div></div>
</div>
<div class="phase-meta">
<div class="meta-item">Est. hours: <span>~45 hrs</span></div>
<div class="meta-item">Topics closed: <span>Electronics ✓ (Final Theory Month)</span></div>
</div>
</div></div>`,
};