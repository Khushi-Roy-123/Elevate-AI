import { motion } from "framer-motion";
import { useStore } from "../../store/useStore";

function Section({ title, accent, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid " + accent + "22",
        borderLeft: "3px solid " + accent,
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "0",
      }}
    >
      <p style={{ color: accent, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", margin: "0 0 8px 0" }}>
        {title}
      </p>
      <div style={{ color: "rgba(212,212,218,0.8)", fontSize: "13px", lineHeight: "1.6" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function ExplainTab() {
  const { result } = useStore();
  const exp = result?.explanation;
  if (!exp) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "16px" }}>
      {exp.whatWentWrong && (
        <Section title="What Went Wrong" accent="#ff3b5c" delay={0}>
          {exp.whatWentWrong}
        </Section>
      )}
      {exp.whyItHappened && (
        <Section title="Root Cause" accent="#00f0ff" delay={0.06}>
          {exp.whyItHappened}
        </Section>
      )}
      {exp.proTip && (
        <Section title="Pro Tip" accent="#00ff9d" delay={0.12}>
          {exp.proTip}
        </Section>
      )}
      {exp.commonMistakes?.length > 0 && (
        <Section title="Common Mistakes" accent="#00f0ff" delay={0.18}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {exp.commonMistakes.map((m, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "rgba(212,212,218,0.65)" }}>
                <span style={{ marginTop: "6px", width: "6px", height: "6px", borderRadius: "50%", background: "#ff3b5c88", flexShrink: 0, display: "inline-block" }} />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {result?.diffSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.12)" }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff9d", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{result.diffSummary}</span>
        </motion.div>
      )}
    </div>
  );
}
