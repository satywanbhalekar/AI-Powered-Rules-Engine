import { Request, Response, NextFunction } from "express";
import { createKeycloakInstance } from "../config/keycloak-config";

/**
 * Middleware to apply Keycloak's `protect()` in a type-safe way.
 * @param permissionToBe Required permission string in format "resource-scope"
 */
export function keycloakEnforcer(permissionToBe: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const client_id: string = req.headers.client_id as string;
    const permissions: string = req.headers.permissions as string;

    if (!permissions) {
      console.warn("🚫 No permissions provided");
       res.status(400).json({
        success: false,
        meta: {
          tracingId: req.headers.correlationId || '',
          statusCode: 400,
          message: "Missing permissions in request"
        },
        data: []
      });
    }

    // ✅ Basic permission format check using ":" separator
    const parts = permissions.split(":");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
       res.status(400).json({
        success: false,
        meta: {
          tracingId: req.headers.correlationId || '',
          statusCode: 400,
          message: "Permissions are not in correct format"
        },
        data: []
      });
    }

    const permissionToBeChecked = `${parts[1]}-${parts[0]}`;
    if (permissionToBe !== permissionToBeChecked) {
       res.status(400).json({
        success: false,
        meta: {
          tracingId: req.headers.correlationId || '',
          statusCode: 400,
          message: "Wrong permissions"
        },
        data: []
      });
    }

    const realm = req.headers.tenant as string;
    const permissionsArray: string[] = [permissions];

    try {
      const keycloak = await createKeycloakInstance(realm, client_id);
      console.log("✅ Keycloak instance created");

      await keycloak.enforcer(permissionsArray, { resource_server_id: client_id })(req, res, (err?: any) => {
        if (err) {
          console.error("🚫 Keycloak Enforcer Error:", err);
          return res.status(403).json({
            success: false,
            meta: {
              tracingId: req.headers.correlationId || '',
              statusCode: 403,
              message: "Unauthorized access"
            },
            data: []
          });
        }
        console.log("✅ User has required permission, proceeding...");
        next();
      });
    } catch (error: any) {
      console.error("❌ Error in keycloak enforcer:", error.message);
       res.status(500).json({
        success: false,
        meta: {
          tracingId: req.headers.correlationId || '',
          statusCode: 500,
          message: "Internal Server Error"
        },
        data: []
      });
    }
  };
}
