import { agSqlGenerator, agTransformer } from '../transformer/ag';
import { agCommSqlGenerator, agCommTransformer } from '../transformer/agComm';
import { agIISqlGenerator, agIITransformer } from '../transformer/agII';
import { appSqlGenerator, appTransformer } from '../transformer/app';
import { appAgSqlGenerator, appAgTransformer } from '../transformer/appAg';
import { appFloorUnitSqlGenerator, appFloorUnitTransformer } from '../transformer/appFlootUnit';
import { appLmSqlGenerator, appLmTransformer } from '../transformer/appLm';
import { appPropertySqlGenerator, appPropertyTransformer } from '../transformer/appProperty';
import { appResultSqlGenerator, appResultTransformer } from '../transformer/appResult';
import { appResultFloorSqlGenerator, appResultFloorTransformer } from '../transformer/appResultFloor';
import { assessmentSqlGenerator, assessmentTransformer } from '../transformer/assessment';
import { bdDloInspectionSqlGenerator, bdDloInspectionTransformer } from '../transformer/bdDloInspection';
import { caseAppSqlGenerator, caseAppTransformer } from '../transformer/caseApp';
import { crvMemoSqlGenerator, crvMemoTransformer } from '../transformer/crvMemo';
import { propertySqlGenerator, propertyTransformer } from '../transformer/property';
import { rentalSqlGenerator, rentalTransformer } from '../transformer/rental';
import { ruralRepSqlGenerator, ruralRepTransformer } from '../transformer/rr';
import { ubwSqlGenerator, ubwTransformer } from '../transformer/ubw';
import { ubwFollowUpSqlGenerator, ubwFollowUpTransformer } from '../transformer/ubwFollowUp';

export const tableCodeMapping = {
  int_001: { name: 'int_app_lm', idField: 'int_file_id', handleFunction: appLmTransformer, sqlGenerator: appLmSqlGenerator },
  int_002: { name: 'int_app', idField: 'int_app_id', handleFunction: appTransformer, sqlGenerator: appSqlGenerator },
  int_003: { name: 'int_case_app', idField: 'int_case_app_id', handleFunction: caseAppTransformer, sqlGenerator: caseAppSqlGenerator },
  int_004: { name: 'int_app_applicant', idField: 'int_applicant_id', handleFunction: appAgTransformer, sqlGenerator: appAgSqlGenerator },
  int_005: { name: 'int_app_ii_status', idField: 'int_applicant_ii_id', handleFunction: agIITransformer, sqlGenerator: agIISqlGenerator },
  int_006: { name: 'int_rural_representative', idField: 'int_rr_application_id', handleFunction: ruralRepTransformer, sqlGenerator: ruralRepSqlGenerator },
  int_007: { name: 'int_applicant_grantee', idField: 'int_ag_id', handleFunction: agTransformer, sqlGenerator: agSqlGenerator },
  int_008: { name: 'int_applicant_grantee_contact', idField: 'int_ag_comm_id', handleFunction: agCommTransformer, sqlGenerator: agCommSqlGenerator },
  int_009: { name: 'int_property', idField: 'int_property_id', handleFunction: propertyTransformer, sqlGenerator: propertySqlGenerator },
  int_010: { name: 'int_app_property', idField: 'int_app_property_id', handleFunction: appPropertyTransformer, sqlGenerator: appPropertySqlGenerator },
  int_011: { name: 'int_crv_memo', idField: 'int_crv_memo_id', handleFunction: crvMemoTransformer, sqlGenerator: crvMemoSqlGenerator },
  int_012: { name: 'int_assessment', idField: 'int_assessment_id', handleFunction: assessmentTransformer, sqlGenerator: assessmentSqlGenerator },
  int_013: { name: 'int_property_rental', idField: 'int_rental_id', handleFunction: rentalTransformer, sqlGenerator: rentalSqlGenerator },
  int_016: { name: 'int_app_property_floor_unit', idField: 'int_floor_unit_id', handleFunction: appFloorUnitTransformer, sqlGenerator: appFloorUnitSqlGenerator },
  int_017: { name: 'int_property_bd_dlo_inspection', idField: 'int_property_bd_dlo_inspection_id', handleFunction: bdDloInspectionTransformer, sqlGenerator: bdDloInspectionSqlGenerator },
  int_018: { name: 'int_property_ubw', idField: 'int_ubw_id', handleFunction: ubwTransformer, sqlGenerator: ubwSqlGenerator },
  int_019: { name: 'int_property_ubw_followup', idField: 'int_ubw_floor_followup_id', handleFunction: ubwFollowUpTransformer, sqlGenerator: ubwFollowUpSqlGenerator },
  int_028: { name: 'int_app_result', idField: 'int_app_result_id', handleFunction: appResultTransformer, sqlGenerator: appResultSqlGenerator },
  int_029: { name: 'int_app_result_assessment', idField: 'int_app_result_floor_unit_id', handleFunction: appResultFloorTransformer, sqlGenerator: appResultFloorSqlGenerator },
  int_031: { name: 'int_review_result', idField: 'int_review_id', handleFunction: () => { }, sqlGenerator: () => { } },
  int_055: { name: 'int_system_district', idField: 'int_district_id', handleFunction: () => { }, sqlGenerator: () => { } }
};
