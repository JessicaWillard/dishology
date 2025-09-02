"use client";

import { useState } from "react";
import { SupplierForm } from "@/components/SupplierForm";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SupplierCard } from "@/components/SupplierCard";
import type { Supplier } from "@/types/supplier";

interface TestSuppliersClientProps {
  userId: string;
}

export function TestSuppliersClient({ userId }: TestSuppliersClientProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { suppliers, loading, error, refetch } = useSuppliers();

  const handleCreateSuccess = (supplier: Supplier) => {
    console.log("Supplier created:", supplier);
    setShowCreateForm(false);
    // The useSuppliers hook will automatically update the list
  };

  const handleCreateError = (error: Error) => {
    console.error("Failed to create supplier:", error);
    alert(`Error creating supplier: ${error.message}`);
  };

  const handleEditSuccess = (supplier: Supplier) => {
    console.log("Supplier updated:", supplier);
    setEditingSupplier(null);
    // The useSuppliers hook will automatically update the list
  };

  const handleEditError = (error: Error) => {
    console.error("Failed to update supplier:", error);
    alert(`Error updating supplier: ${error.message}`);
  };

  const handleEdit = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setEditingSupplier(supplier);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const response = await fetch(`/api/suppliers/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          refetch();
        } else {
          throw new Error("Failed to delete supplier");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete supplier");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Debug Information</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          <p>
            <strong>Suppliers Count:</strong> {suppliers.length}
          </p>
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          {error && (
            <p className="text-red-600">
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
      </div>

      {/* Create Form Section */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="solid"
            iconOnly
            handlePress={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? <Icon name="CloseBtn" /> : <Icon name="Plus" />}
          </Button>
        </div>

        {showCreateForm && (
          <SupplierForm
            mode="create"
            onSuccess={handleCreateSuccess}
            onError={handleCreateError}
            onCancel={() => setShowCreateForm(false)}
            showCancel={true}
          />
        )}
      </div>

      {/* Edit Form Section */}
      {editingSupplier && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit Supplier</h2>
            <Button
              variant="outline"
              handlePress={() => setEditingSupplier(null)}
            >
              Cancel Edit
            </Button>
          </div>

          <SupplierForm
            mode="edit"
            initialData={editingSupplier}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
            onCancel={() => setEditingSupplier(null)}
            showCancel={true}
          />
        </div>
      )}

      {/* Suppliers List Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Existing Suppliers</h2>
          <Button
            variant="outline"
            handlePress={() => refetch()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {loading && suppliers.length === 0 ? (
          <p className="text-gray-500">Loading suppliers...</p>
        ) : error ? (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
            <p className="font-semibold">Error loading suppliers:</p>
            <p>{error}</p>
            <Button
              variant="outline"
              handlePress={() => refetch()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-500">
            No suppliers found. Create your first supplier above!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                id={supplier.id}
                supplierName={supplier.name}
                description={supplier.description}
                contactName={supplier.contact.contactName}
                email={supplier.contact.email}
                phone={supplier.contact.phone}
                website={supplier.contact.website}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
