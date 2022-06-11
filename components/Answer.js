import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Circle, CheckCircle } from "react-feather";

export default function Answer({ children, checked = null, percentage = false, onSelect }) {
  return (
    <button onClick={onSelect ? onSelect : () => { }} className="text-3xl border border-stone-400 w-full text-left text-stone-800 font-bold">
      <div className="flex justify-between">
        <div className="flex items-center py-2 px-4">
          {checked !== null &&

            (checked ? (
              <CheckCircle className="mr-4" />
            ) : (
              <Circle className="mr-4" />
            ))
          }
          {children}
        </div>
        {percentage !== false && (
          <div className="bg-stone-300 text-stone-600 h-full text-md font-normal py-3 px-3">
            {percentage}%
          </div>
        )}
      </div>
    </button>
  );
}
