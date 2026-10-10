import { useId } from 'react';
import type { Identity } from '../domain/model';

/** Editable provisional engravings for identities with no supplied raster portrait. */
export function CardEngraving({ identity }: { identity: Identity }) {
  const uid = useId();
  const person = identity.family === 'person';
  const palette = identity.id === 'C04' ? '#5e7460' : identity.id === 'C03' ? '#647d85' : '#6b547b';
  return (
    <svg className="card-engraving artwork" viewBox="0 0 240 320" aria-hidden="true">
      <defs>
        <radialGradient id={'paper-' + uid}>
          <stop stopColor="#73526a" />
          <stop offset="1" stopColor="#251c31" />
        </radialGradient>
        <linearGradient id={'gold-' + uid} x2="1" y2="1">
          <stop stopColor="#ffe6a7" />
          <stop offset=".5" stopColor="#b78c4a" />
          <stop offset="1" stopColor="#f0c778" />
        </linearGradient>
      </defs>
      <rect width="240" height="320" fill={'url(#paper-' + uid + ')'} />
      <path
        d="M17 301V86Q20 18 120 12Q220 18 223 86V301Z"
        fill="none"
        stroke="#c9a16a"
        strokeWidth="2"
      />
      <path
        d="M30 285V91Q30 34 120 27Q210 34 210 91V285Z"
        fill="none"
        stroke="#c9a16a"
        opacity=".45"
      />
      {[45, 82, 160, 196].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${60 + (i % 2) * 27}l2 6 6 2-6 2-2 6-2-6-6-2 6-2z`}
          fill="#f6d490"
          opacity=".7"
        />
      ))}
      {person ? (
        <>
          <path
            d="M31 294q9-79 60-89h58q51 10 60 89"
            fill={palette}
            stroke="#d4b680"
            strokeWidth="2"
          />
          <path d="M75 232l45 53 45-53-12-33H88Z" fill="#ddd1ab" />
          <path d="M103 172h34v49q-17 24-34 0z" fill="#d4a480" />
          <ellipse
            cx="120"
            cy="147"
            rx={identity.id === 'C03' ? 46 : 39}
            ry="52"
            fill="#e2b791"
            stroke="#e8c592"
            strokeWidth="2"
          />
          {identity.id === 'C02' ? (
            <>
              <path d="M73 151q-14-76 47-80 65 5 48 90l-13-48q-33 9-61-1z" fill="#adac9f" />
              <path
                d="M43 102l40-14 27-65 46 61 44 21q-76 30-157-3"
                fill="#39473d"
                stroke="#c6ae7c"
                strokeWidth="2"
              />
              <path d="M91 77l62 5" stroke="#d4ac62" strokeWidth="5" />
              <path
                d="M83 143q17-12 32 0m12 0q17-12 32 0m-44 0h12"
                fill="none"
                stroke="#66503e"
                strokeWidth="2"
              />
              <path d="M80 133l16-4m49 0l15 4" stroke="#655340" strokeWidth="2" />
              <path d="M114 218l-18 16 25 27 26-28-19-15" fill="#39533f" />
              <circle cx="119" cy="238" r="9" fill="#e7c17c" />
            </>
          ) : identity.id === 'C03' ? (
            <>
              <path d="M73 138q-8-58 47-53 52-3 48 54l-14-29-21-13-28 5-23 19z" fill="#d8d0b3" />
              <path d="M65 138q-12 19 8 29m102-29q12 19-8 29" fill="#d4a480" />
              <path d="M89 133l18-2m27 1l18 3" stroke="#70523c" strokeWidth="3" />
              <path d="M111 175q-20-7-25 8 22 17 35-3 10 20 33 3-8-14-25-8" fill="#ded6bd" />
              <path d="M97 214l23 31 23-31" fill="#c8a35f" />
              <path d="M116 244l-5 50h20l-8-50" fill="#c8a35f" />
              <path d="M166 255l22-76" stroke="#e7c78a" strokeWidth="4" />
              <path d="M188 160v12m-6-6h12" stroke="#ffe4a7" strokeWidth="2" />
            </>
          ) : (
            <>
              <path d="M72 145q-13-75 48-73 65-1 46 92l-17-44q-27 1-54-15l-8 47" fill="#b6aba2" />
              <path
                d="M35 114q8-25 48-30l16-29 42-6 16 39q34 4 48 29-88 24-170-3"
                fill="#806948"
                stroke="#d4b780"
                strokeWidth="2"
              />
              <path d="M83 91q33 15 75 0" fill="none" stroke="#ddc591" strokeWidth="5" />
              <path d="M92 216l28 64 30-64" fill="#597760" />
              <path
                d="M179 298q-37-43-11-79m-2 52q-24-19-29-1m34-24q31-27 24-4"
                fill="none"
                stroke="#9eb482"
                strokeWidth="3"
              />
              <circle cx="169" cy="220" r="12" fill="#e0ae74" />
              <circle cx="169" cy="220" r="4" fill="#795d4b" />
            </>
          )}
          <circle cx="101" cy="147" r="3" fill="#47372d" />
          <circle cx="139" cy="147" r="3" fill="#47372d" />
          <path
            d="M119 146l-5 18h10m-21 16q17 12 34-1"
            stroke="#906749"
            strokeWidth="2"
            fill="none"
          />
          <path d="M70 260l-8 37m106-37 10 37" stroke="#dbc48f" strokeWidth="1" opacity=".7" />
        </>
      ) : identity.id === 'O03' ? (
        <>
          <path
            d="M66 70h108v20l-11 16v135q-43 33-86 0V106L66 90Z"
            fill="#70a79c33"
            stroke="#d6cfa7"
            strokeWidth="3"
          />
          <path d="M71 64h98v14H71Z" fill="#aa7953" stroke="#dfb681" strokeWidth="2" />
          <path d="M81 214q17-16 32-3t46-6v33q-39 24-78 0Z" fill="#436b55" />
          <path
            d="M100 224v-71m0 34-15-19m15 7 17-28m21 83v-64m0 34 16-24"
            stroke="#d8c497"
            strokeWidth="4"
            fill="none"
          />
          <path d="M85 258h70v32H85Z" fill="#9c7b51" stroke="#dfb981" strokeWidth="2" />
          <path d="M93 277q25-17 52 0" stroke="#4e593f" strokeWidth="3" fill="none" />
        </>
      ) : (
        <>
          <path d="M61 275l20-148 31 6-10 142" fill="#ba7451" stroke="#e6bd76" strokeWidth="2" />
          <path d="M81 127l21-43 10 49Z" fill="#e2b875" />
          <path d="M125 275l-4-112 30-2 16 112" fill="#775385" stroke="#e6bd76" strokeWidth="2" />
          <path d="M120 163l13-46 19 44Z" fill="#d7ac69" />
          <path d="M53 279h133v20H53Z" fill="#5e493c" stroke="#d4b27a" />
          <path
            d="M145 68l26-33m-8 41 40-9m-60-16 1-30m-20 36-24-19"
            stroke="#e8bc79"
            strokeWidth="2"
          />
          <path d="M73 150l31 21m-37 22 33 20m27-34 29 16" stroke="#ebc887" strokeWidth="4" />
        </>
      )}
      <path d="M24 305h192" stroke={'url(#gold-' + uid + ')'} strokeWidth="4" />
    </svg>
  );
}
