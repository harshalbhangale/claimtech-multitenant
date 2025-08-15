import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react';
import { ActionBanner as ActionRequiredBanner } from './ActionRequiredBanner';
import { useClaims } from '../../../hooks/queries/useClaims';
import { useRequirements, useCentralizedRequirementsPolling } from '../../../hooks/queries/useRequirements';
import SignatureModal from './Modals/SignatureModal';
import PreviousAddressModal from './Modals/PreviousAddressModal';
import PreviousNameModal from './Modals/PreviousNameModal';
import IdDocumentModal from './Modals/IdDocumentModal';

import { useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { uploadRequirementDocument} from '../../../api/services/dashboard/additionalRequirement';
import api from '../../../api';

const ClaimRequirementBanners: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { data: requirements = [] } = useRequirements(claimId);
  const getType = (r: any) => (r.backend_type || r.requirement_type || '').toString();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [sigOpen, setSigOpen] = useState(false);
  const [sigReq, setSigReq] = useState<any>(null);
  const [addrOpen, setAddrOpen] = useState(false);
  const [addrReq, setAddrReq] = useState<any>(null);
  const [nameOpen, setNameOpen] = useState(false);
  const [nameReq, setNameReq] = useState<any>(null);
  const [idOpen, setIdOpen] = useState(false);
  const [idReq, setIdReq] = useState<any>(null);
  // Removed docOpen and docReq - generic documents handled in RequirementInfoModal

  const signatureReqs = requirements.filter(r => (r.status === 'pending' || r.status === 'rejected') && getType(r) === 'signature');
  const prevAddrReqs = requirements.filter(r => (r.status === 'pending' || r.status === 'rejected') && getType(r) === 'previous_address');
  const prevNameReqs = requirements.filter(r => (r.status === 'pending' || r.status === 'rejected') && getType(r) === 'previous_name');
  const idDocReqs = requirements.filter(r => (r.status === 'pending' || r.status === 'rejected') && getType(r) === 'id_document');
  // Removed genericDocReqs - "other" type requirements should only show in RequirementInfoModal

  const openSig = () => { const r = signatureReqs[0]; if (r) { setSigReq(r); setSigOpen(true); } };
  const openAddr = () => { const r = prevAddrReqs[0]; if (r) { setAddrReq(r); setAddrOpen(true); } };
  const openName = () => { const r = prevNameReqs[0]; if (r) { setNameReq(r); setNameOpen(true); } };
  const openId = () => { const r = idDocReqs[0]; if (r) { setIdReq(r); setIdOpen(true); } };
  // Removed openDoc - generic documents handled in RequirementInfoModal

  const onSigSuccess = () => {
    setSigOpen(false); setSigReq(null);
    // Immediate UI update and then refetch
    queryClient.invalidateQueries({ queryKey: ['requirements', claimId] });
    queryClient.refetchQueries({ queryKey: ['requirements', claimId] });
  };

  // Removed submitGenericDoc - generic documents handled in RequirementInfoModal

  const submitPrevAddress = async ({ requirementId, address }: { requirementId: string; address: any }) => {
    try {
      // address is { address: selectedAddress, raw: selectedRaw } from PreviousAddressModal
      const rawAddress = address?.raw;
      const ci = rawAddress?.checkio || {};
      
      // Create formatted array with 4 elements as expected by API
      const formatted = [
        rawAddress?.address1 || '',
        rawAddress?.city || '',
        rawAddress?.region || '',
        rawAddress?.postcode || ''
      ].filter(Boolean);
      
      const addressData = {
        reference: ci.reference || rawAddress?.address_id || '',
        formatted: formatted,
        line1: rawAddress?.address1 || '',
        line2: rawAddress?.address2 || '',
        line3: rawAddress?.city || '',
        line4: rawAddress?.region || '',
        organisationName: ci.organisationName || '',
        subBuildingNumber: ci.subBuildingNumber || '',
        subBuildingName: ci.subBuildingName || '',
        buildingName: ci.buildingName || '',
        buildingNumber: ci.buildingNumber || '',
        thoroughfare: ci.thoroughfare || '',
        townOrCity: rawAddress?.city || '',
        district: rawAddress?.city || '',
        county: rawAddress?.region || '',
        country: rawAddress?.country || 'England',
        postcode: rawAddress?.postcode || '',
        longitude: typeof ci.longitude === 'number' ? ci.longitude : 0,
        latitude: typeof ci.latitude === 'number' ? ci.latitude : 0,
      };

      const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, { 
        requirement_id: requirementId, 
        address_data: addressData 
      });
      console.log('Previous address submission response:', response.data);

      setAddrOpen(false); setAddrReq(null);
      // Immediate UI update and then refetch
      queryClient.invalidateQueries({ queryKey: ['requirements', claimId] });
      queryClient.refetchQueries({ queryKey: ['requirements', claimId] });
    } catch (e: any) {
      toast({ title: 'Failed to submit address', description: e?.message || 'Try again later', status: 'error', duration: 4000, isClosable: true });
    }
  };

  const submitPrevName = async ({ requirementId, previousName }: { requirementId: string; previousName: string }) => {
    try {
      const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, { requirement_id: requirementId, previous_name: previousName });
      console.log('Previous name submission response:', response.data);
      setNameOpen(false); setNameReq(null);
      
      // Immediate UI update and then refetch
      queryClient.invalidateQueries({ queryKey: ['requirements', claimId] });
      queryClient.refetchQueries({ queryKey: ['requirements', claimId] });
      
      // Also invalidate the claims query to ensure everything is fresh
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      
    } catch (e: any) {
      toast({ title: 'Failed to submit name', description: e?.message || 'Try again later', status: 'error', duration: 4000, isClosable: true });
    }
  };

  const submitIdDoc = async ({ requirementId, file }: { requirementId: string; file: File }) => {
    try {
      // Use 'id_document' field name for Photo ID uploads
      await uploadRequirementDocument(claimId, requirementId, file, 'id_document');

      setIdOpen(false); setIdReq(null);
      // Immediate UI update and then refetch
      queryClient.invalidateQueries({ queryKey: ['requirements', claimId] });
      queryClient.refetchQueries({ queryKey: ['requirements', claimId] });
    } catch (e: any) {
      // Show friendly message instead of backend error like 'Previous name is required...'
      toast({
        title: "The ID you uploaded can't be accepted",
        description: 'Please upload another clear picture of your ID',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const showAny = signatureReqs.length || prevAddrReqs.length || prevNameReqs.length || idDocReqs.length;
  if (!showAny) return null;

  return (
    <>
      {signatureReqs.length > 0 && (
        <ActionRequiredBanner label="Digital signature required" buttonText="Update Signature" onAction={openSig} />
      )}
      {prevAddrReqs.length > 0 && (
        <ActionRequiredBanner label="Previous address required" buttonText="Submit Address" onAction={openAddr} />
      )}
      {prevNameReqs.length > 0 && (
        <ActionRequiredBanner label="Previous name required" buttonText="Submit Name" onAction={openName} />
      )}
      {idDocReqs.length > 0 && (
        <ActionRequiredBanner label="Photo ID required" buttonText="Upload ID" onAction={openId} />
      )}

      <SignatureModal isOpen={sigOpen} onClose={() => setSigOpen(false)} requirementReason={sigReq?.requirement_reason} onSuccess={onSigSuccess} mode="dashboard" claimId={claimId} requirementId={sigReq?.id} />
      <PreviousAddressModal isOpen={addrOpen} onClose={() => setAddrOpen(false)} requirementReason={addrReq?.requirement_reason} claimId={claimId} requirementId={addrReq?.id} onSubmit={submitPrevAddress} />
      <PreviousNameModal isOpen={nameOpen} onClose={() => setNameOpen(false)} requirementReason={nameReq?.requirement_reason} claimId={claimId} requirementId={nameReq?.id} onSubmit={submitPrevName} />
      <IdDocumentModal isOpen={idOpen} onClose={() => setIdOpen(false)} requirementReason={idReq?.requirement_reason} claimId={claimId} requirementId={idReq?.id} onSubmit={submitIdDoc} title="Upload Photo ID" />
    </>
  );
};

const GlobalRequirementBanners: React.FC = () => {
  const { data: claims = [] } = useClaims();
  const queryClient = useQueryClient();
  
  // Centralized polling for all requirements - ensures staff additions are caught immediately
  useCentralizedRequirementsPolling();
  
  // Immediate updates when user returns to tab or network is restored
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to the tab, immediately refetch all requirements
        claims?.forEach(claim => {
          queryClient.invalidateQueries({ queryKey: ['requirements', claim.id] });
        });
      }
    };

    const handleFocus = () => {
      // User switched back to the tab, immediately refetch all requirements
      claims?.forEach(claim => {
        queryClient.invalidateQueries({ queryKey: ['requirements', claim.id] });
      });
    };

    const handleOnline = () => {
      // Network connection restored, immediately refetch all requirements
      claims?.forEach(claim => {
        queryClient.invalidateQueries({ queryKey: ['requirements', claim.id] });
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [claims, queryClient]);
  
  if (!claims || claims.length === 0) return null;
  return (
    <VStack spacing={3} align="stretch">
      {claims.map((c: any) => (
        <ClaimRequirementBanners key={c.id} claimId={c.id} />
      ))}
    </VStack>
  );
};

export default GlobalRequirementBanners;
export { GlobalRequirementBanners };
