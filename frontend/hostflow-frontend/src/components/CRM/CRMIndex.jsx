import React from "react";
import Leads from "./Leads";
import PipelineKanban from "./PipelineKanban";

export default function CRMIndex() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">CRM</h1>
      <div className="mb-8">
        <PipelineKanban />
      </div>
      <Leads />
    </div>
  );
}
