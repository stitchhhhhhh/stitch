import { useState } from "react";

export default function NotificationSettings() {

  const [items,setItems]=useState([
    {title:"Course approval notifications",on:true},
    {title:"Training proposal notifications",on:true},
    {title:"Report notifications",on:false},
    {title:"Deadline reminders",on:true}
  ]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <h2 className="font-semibold text-xl mb-8">
        🔔 Notification Preferences
      </h2>

      <div className="space-y-6">

        {items.map((item,index)=>(

          <div
            key={item.title}
            className="flex justify-between items-center border-b pb-5"
          >

            <div>

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm">
                Notification preference
              </p>

            </div>

            <button
              onClick={()=>{
                const copy=[...items];
                copy[index].on=!copy[index].on;
                setItems(copy);
              }}
              className={`w-12 h-7 rounded-full transition ${
                item.on ? "bg-[#2F3FE4]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition ${
                  item.on ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}