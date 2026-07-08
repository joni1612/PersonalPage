import type { TechGroup } from "../types";
import styles from "./TechStack.module.css";

export default function TechStack({ groups }: { groups: TechGroup[] }) {
  return (
    <ul className={styles.groups}>
      {groups.map((group) => (
        <li key={group.label} className={styles.group}>
          <h3 className={styles.groupLabel}>{group.label}</h3>
          <ul className={styles.items}>
            {group.items.map((item) => (
              <li key={item} className={styles.item}>
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
