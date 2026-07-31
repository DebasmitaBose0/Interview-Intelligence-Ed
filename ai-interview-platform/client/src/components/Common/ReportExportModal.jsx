import React from 'react';
import { Download, FileText, Printer, X, CheckCircle, Table, FileSpreadsheet } from 'lucide-react';
import Modal from './Modal';
import { exportReportData } from '../../utils/analyticsExporter';

export default function ReportExportModal({ open, onClose, onDownload, onPrint, downloading, downloaded, reportData }) {
  const handleExportCSV = () => {
    if (reportData) {
      exportReportData(reportData, 'csv');
    }
  };

  const handleExportJSON = () => {
    if (reportData) {
      exportReportData(reportData, 'json');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Assessment Report"
      description="Choose your preferred export format for candidate evaluation results."
      width="460px"
      footer={
        <button
          onClick={onClose}
          style={{
            padding: '8px 20px', background: 'transparent', color: '#888', border: '1px solid #333',
            borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={onDownload}
          disabled={downloading}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#0d0d0d', cursor: downloading ? 'not-allowed' : 'pointer',
            color: '#e0e0e0', fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'all 0.15s',
            opacity: downloading ? 0.6 : 1,
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {downloading ? <X size={18} color="#888" /> : downloaded ? <CheckCircle size={18} color="#4ade80" /> : <Download size={18} color="#ccc" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Download PDF Document</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
              {downloading ? 'Compiling PDF document...' : downloaded ? 'Report exported successfully' : 'Comprehensive styled PDF summary'}
            </div>
          </div>
        </button>

        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#0d0d0d', cursor: 'pointer',
            color: '#e0e0e0', fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'all 0.15s',
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileSpreadsheet size={18} color="#60a5fa" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Export Spreadsheet (CSV)</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Tabular dataset for Excel and data analytics</div>
          </div>
        </button>

        <button
          onClick={handleExportJSON}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#0d0d0d', cursor: 'pointer',
            color: '#e0e0e0', fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'all 0.15s',
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Table size={18} color="#a78bfa" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Export Raw JSON Data</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Structured JSON payload for API integration</div>
          </div>
        </button>

        <button
          onClick={onPrint}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#0d0d0d', cursor: 'pointer',
            color: '#e0e0e0', fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'all 0.15s',
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Printer size={18} color="#ccc" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Print Report</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Send directly to physical/digital printer</div>
          </div>
        </button>
      </div>
    </Modal>
  );
}