import React, { useState } from 'react';
import Student from './Student/Student';
import StaffDashboard from "./Dashboard/StaffDashboard"; 

const ParentComponent = () => {

  const[courseCount, setCourseCount] = useState();

  return (
    <div>
      <Student courseBatchCounts={courseCount} />

      <StaffDashboard courseBatchCounts={courseCount} />
    </div>
  );
};

export default ParentComponent;
