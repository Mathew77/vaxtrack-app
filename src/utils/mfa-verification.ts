/**
 * MFA verification utility using dedicated server-side verification endpoint
 */
import axios from 'axios';
import { url } from 'src/hooks/api';

interface MfaVerificationRequest {
  identifier: string;
  code: string;
  by?: 'username' | 'id' | 'email';
}

interface MfaVerificationResponse {
  ok: boolean;
  code?: string;
  detail?: string;
  data?: {
    user_id: number;
    username: string;
  };
}

export const validateMfaForSubmission = async (
  inputMfaCode: string
): Promise<{isValid: boolean, error?: string}> => {

  if (!inputMfaCode || !inputMfaCode.trim()) {
    return {
      isValid: false,
      error: 'mfa_required to approve'
    };
  }

  try {
    const currentUsername = sessionStorage.getItem('username');
    if (!currentUsername) {
      return {
        isValid: false,
        error: 'mfa_required to approve'
      };
    }

    const requestData: MfaVerificationRequest = {
      identifier: currentUsername,
      code: inputMfaCode.trim(),
      by: 'username'
    };

    try {

      const axiosResponse = await axios.post<MfaVerificationResponse>(
        `${url}v1/verify-mfa/`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        }
      );

      const response = axiosResponse.data;

      if (response.ok) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          error: 'Invalid MFA code. Please check and try again.'
        };
      }
    } catch (apiError: unknown) {
      console.error('MFA API error:', apiError);
      return {
        isValid: false,
        error: 'Invalid MFA code. Please check and try again.'
      };
    }
  } catch (error) {
    console.error('MFA verification error:', error);
    return {
      isValid: false,
      error: 'Invalid MFA code. Please check and try again.'
    };
  }
};