import { useId } from 'react';
import type { Family } from '../domain/model';
export function AlleyArt() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="alley-art artwork" viewBox="0 0 390 430" aria-hidden="true">
      <defs>
        <linearGradient id={id + 'sky'} x2="0" y2="1">
          <stop stopColor="#34304d" />
          <stop offset="1" stopColor="#997d89" />
        </linearGradient>
        <linearGradient id={id + 'wall'} x2="1" y2="1">
          <stop stopColor="#e4a767" />
          <stop offset="1" stopColor="#ac553a" />
        </linearGradient>
        <linearGradient id={id + 'glass'} x2="1" y2="1">
          <stop stopColor="#fff0ba" />
          <stop offset="1" stopColor="#d7a563" />
        </linearGradient>
        <pattern id={id + 'brick'} width="38" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 22h38M19 0v22" stroke="#744134" strokeWidth="1" opacity=".35" />
        </pattern>
        <pattern id={id + 'stone'} width="60" height="26" patternUnits="userSpaceOnUse">
          <path d="M0 25h60M30 0v25" stroke="#796779" strokeWidth="2" opacity=".5" />
        </pattern>
      </defs>
      <g className="scene-background">
        <path fill={'url(#' + id + 'sky)'} d="M0 0h390v430H0z" />
        <circle cx="302" cy="55" r="27" fill="#eed4a0" />
        <circle cx="293" cy="46" r="26" fill="#454057" />
        <path
          d="M80 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM212 48l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"
          fill="#e9d7b5"
        />
        <path
          d="M37 250V105l37-42 30 55v135M292 256V99l35-31 19 36v168"
          fill="#524352"
          stroke="#312839"
          strokeWidth="3"
        />
        <path d="M56 125h16v28H56zM313 127h13v28h-13z" fill="#c8a57b" />
        <path d="M72 201h11v22H72zM322 202h11v22h-11z" fill="#ae8c73" />
      </g>
      <g className="scene-facades">
        <path d="M-22 114l67-18 32 195-81 34z" fill="#626e6c" stroke="#2e3a42" strokeWidth="4" />
        <path
          d="M2 129l28-7 3 44-28 6zM14 198l29-8 8 63-32 9z"
          fill="#302e42"
          stroke="#958b7a"
          strokeWidth="5"
        />
        <path d="M345 125l56-30v248l-59-34z" fill="#56435d" stroke="#322a3b" strokeWidth="4" />
        <path d="M363 140l22-10v64l-22 7z" fill="#a07879" stroke="#2a2736" strokeWidth="5" />
        <path
          d="M75 153l200-12 53 170-272 15z"
          fill={'url(#' + id + 'wall)'}
          stroke="#51342f"
          strokeWidth="5"
        />
        <path d="M75 153l200-12 53 170-272 15z" fill={'url(#' + id + 'brick)'} />
        <path
          d="M59 157l147-87 100 81-30 20-87-49-116 56z"
          fill="#453148"
          stroke="#302538"
          strokeWidth="5"
        />
        <path
          d="M74 150l113-61 97 62M95 155l94-48 77 46"
          fill="none"
          stroke="#96667b"
          strokeWidth="3"
        />
        <path d="M177 77l8-61 34 9-1 45z" fill="#775050" stroke="#3d2e38" strokeWidth="5" />
        <path d="M182 27l40 5 2-12-38-7z" fill="#412d3d" />
        <path
          d="M101 213q17-26 47-5l-4 74-54 6zM245 209q18-30 44-5l11 74-54 7z"
          fill={'url(#' + id + 'glass)'}
          stroke="#563143"
          strokeWidth="7"
        />
        <path
          d="M120 206l-5 77M94 241l53-5M267 199l6 82M249 237l46-3"
          stroke="#633848"
          strokeWidth="4"
        />
        <path
          d="M154 320l7-84q-1-51 31-55 32-1 40 50l10 87z"
          fill="#473040"
          stroke="#643934"
          strokeWidth="6"
        />
        <path
          d="M173 239q-5-34 19-37 18-2 23 33z"
          fill="#c9ad75"
          stroke="#9b7056"
          strokeWidth="3"
        />
        <path d="M168 253h51v52h-51z" fill="#724450" stroke="#a07463" strokeWidth="2" />
        <circle cx="214" cy="269" r="4" fill="#d6ad67" />
        <path
          d="M77 304l71-8v15l-77 9zM239 295l75-5 5 17-79 7z"
          fill="#79503c"
          stroke="#543a36"
          strokeWidth="3"
        />
        <g className="swing-sign">
          <path d="M98 170l160-7 7 29-172 10z" fill="#492f50" stroke="#edba78" strokeWidth="3" />
          <path d="M95 170l5-14M250 164v-13" stroke="#3f2b37" strokeWidth="3" />
          <path d="M107 183l12-1M243 176l11-1" stroke="#c79b64" strokeWidth="2" />
        </g>
        <g>
          <path d="M313 142l-4 50M303 144l20-1" stroke="#2e2a35" strokeWidth="4" />
          <path d="M299 183l21-1 7 30-35 3z" fill="#eac087" stroke="#39303b" strokeWidth="4" />
          <path className="lantern-light" d="M298 187l17-1 4 22-24 2z" fill="#ffedb1" />
          <path d="M309 182l1 31" stroke="#604a3c" strokeWidth="2" />
        </g>
      </g>
      <g className="scene-foreground">
        <path d="M0 335l150-27 100 1 140 37v84H0z" fill="#9a8180" />
        <path d="M0 335l150-27 100 1 140 37v84H0z" fill={'url(#' + id + 'stone)'} />
        <path d="M154 324l-73 106M234 324l88 106" stroke="#675460" strokeWidth="3" opacity=".5" />
        <path d="M16 315q18-38 30 0v43H16z" fill="#7b413e" stroke="#473336" strokeWidth="4" />
        <path d="M17 326h28M18 345h27" stroke="#bb8763" strokeWidth="3" />
        <path d="M324 321l37 7-9 28-40-8z" fill="#936148" stroke="#4f3a38" strokeWidth="4" />
        <path d="M328 324l-4 23M344 326l-4 25" stroke="#d0a574" strokeWidth="3" />
        <path
          d="M3 400q46-12 72 4M312 404q25-14 69-4"
          fill="none"
          stroke="#bd9d91"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
export function InteriorArt() {
  return (
    <svg className="interior-art artwork" viewBox="0 0 390 310" aria-hidden="true">
      <defs>
        <pattern id="wall-lines" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M13 0v26" stroke="#ca9b6c" strokeWidth="2" opacity=".25" />
        </pattern>
      </defs>
      <path fill="#744850" d="M0 0h390v310H0z" />
      <path fill="url(#wall-lines)" d="M0 0h390v310H0z" />
      <path
        d="M15 26L195 8l180 18v27L195 34 15 54z"
        fill="#472d37"
        stroke="#b3825d"
        strokeWidth="3"
      />
      <path d="M38 84h314v113H38z" fill="#453039" stroke="#ae7855" strokeWidth="8" />
      <path
        d="M27 143h335v13H27zM23 193h344v18H23z"
        fill="#bc8557"
        stroke="#573b33"
        strokeWidth="3"
      />
      {[56, 107, 259, 309].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} 88l27 -8 5 50 -31 5z`}
            fill={i % 2 ? '#497d79' : '#b97450'}
            stroke="#d8b787"
            strokeWidth="2"
          />
          <path d={`M${x + 8} 88l4 36`} stroke="#d9b891" strokeWidth="3" />
        </g>
      ))}
      <path d="M157 89l31-14 37 19-4 31-61 1z" fill="#523762" stroke="#e1b775" strokeWidth="3" />
      <path d="M164 111l28-12 25 11-23 11z" fill="#986586" />
      <path d="M67 170h26l7 18H61zM293 167h30l5 21h-40z" fill="#ddad69" />
      <path d="M11 227l181-15 185 16v82H11z" fill="#9d6648" stroke="#5b3b34" strokeWidth="6" />
      <path
        d="M8 228l184-18 187 18-3 26-182-8-184 11z"
        fill="#d3a16a"
        stroke="#6a4435"
        strokeWidth="4"
      />
      <path d="M42 270h303M194 254v56" stroke="#714a36" strokeWidth="3" />
      <path d="M172 263l23-8 22 10-21 11z" fill="#503849" stroke="#c49a68" strokeWidth="2" />
    </svg>
  );
}
export function FamilyArt({ family }: { family: Family }) {
  return (
    <svg className="family-art artwork" viewBox="0 0 120 150" aria-hidden="true">
      <path
        d="M17 30L60 7l43 23v89l-43 24-43-24z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity=".5"
      />
      {family === 'person' ? (
        <g>
          <path d="M37 50l23-30 25 30z" fill="currentColor" />
          <circle cx="60" cy="63" r="14" fill="currentColor" />
          <path d="M31 117q-2-36 29-36t29 36z" fill="currentColor" />
          <path d="M53 34l5 2M67 41l4 1" stroke="#f2e0bc" strokeWidth="2" />
        </g>
      ) : family === 'object' ? (
        <g>
          <path d="M27 109l67-68" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
          <path
            d="M44 40l3 10 10 3-10 3-3 10-3-10-10-3 10-3zM86 88l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"
            fill="currentColor"
          />
          <path d="M82 32v-8M99 49h9" stroke="currentColor" strokeWidth="3" />
        </g>
      ) : (
        <g>
          <path
            d="M52 46c30-5 43 40 18 61-22 20-48-11-42-30 4-13 24-6 24-31z"
            fill="currentColor"
          />
          <path d="M67 61q18 12 5 32" fill="none" stroke="#f2e0bc" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}
export function FrogArt() {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true">
      <ellipse cx="60" cy="44" rx="30" ry="22" fill="#613e2f" stroke="#b37e4c" strokeWidth="3" />
      <path
        d="M36 43q-38 16-15 29l22-5M84 43q38 16 15 29l-22-5"
        fill="#754734"
        stroke="#b37e4c"
        strokeWidth="3"
      />
      <circle cx="45" cy="25" r="12" fill="#79513b" stroke="#b37e4c" strokeWidth="3" />
      <circle cx="75" cy="25" r="12" fill="#79513b" stroke="#b37e4c" strokeWidth="3" />
      <circle cx="45" cy="24" r="4" fill="#f0d6a0" />
      <circle cx="75" cy="24" r="4" fill="#f0d6a0" />
      <path d="M48 48q12 9 24 0" stroke="#382b27" strokeWidth="3" fill="none" />
    </svg>
  );
}
export function FrogBox({ animate = false }: { animate?: boolean }) {
  return (
    <div className={'frog-stage artwork ' + (animate ? 'ritual' : '')} aria-hidden="true">
      <div className="frog-shadow" />
      <div className="box-interior" />
      <div className="box-base">
        <span>✦</span>
      </div>
      <div className="box-lid">
        <span>✦</span>
      </div>
      <div className="frog-subject">
        <FrogArt />
      </div>
      <div className="ritual-card">
        <span>✦</span>
      </div>
    </div>
  );
}
