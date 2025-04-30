import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Share, 
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import QRCode from 'react-native-qrcode-svg';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  borderColor: '#cccccc',
  errorColor: '#d32f2f',
  successColor: '#388e3c',
  warningColor: '#f57c00',
  highlightYellow: '#ffd700',
};

export default function BarcodeComponent({ registration, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [qrRef, setQrRef] = useState(null);

  // Generate HTML for the ticket
  const generateTicketHTML = () => {
    const isConfirmed = registration.status === 'Confirmed' || registration.status === 'Paid';
    const statusColor = isConfirmed ? COLORS.successColor : COLORS.warningColor;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .ticket-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .ticket-header {
              background-color: ${COLORS.primaryBlue};
              color: white;
              padding: 20px;
              text-align: center;
            }
            .event-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .ticket-number {
              font-size: 16px;
              opacity: 0.9;
            }
            .ticket-body {
              padding: 20px;
            }
            .attendee-info {
              margin-bottom: 20px;
            }
            .info-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 18px;
              margin-bottom: 15px;
            }
            .barcode-container {
              text-align: center;
              margin: 20px 0;
              padding: 15px;
              border-top: 1px dashed #ccc;
              border-bottom: 1px dashed #ccc;
            }
            .barcode {
              max-width: 100%;
              height: auto;
            }
            .status-badge {
              display: inline-block;
              background-color: ${statusColor};
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-header">
              <div class="event-name">${registration.eventName}</div>
              <div class="ticket-number">${registration.ticketNumber}</div>
            </div>
            
            <div class="ticket-body">
              <div class="attendee-info">
                <div class="info-label">Attendee</div>
                <div class="info-value">${registration.registrantName}</div>
                
                <div class="info-label">Registration Type</div>
                <div class="info-value">${registration.registrationType}</div>
                
                <div class="info-label">Registration Date</div>
                <div class="info-value">${registration.registrationDate}</div>
                
                <div class="info-label">Status</div>
                <div class="status-badge">${registration.status}</div>
              </div>
              
              <div class="barcode-container">
                <img class="barcode" src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(JSON.stringify({
                  ticketNumber: registration.ticketNumber,
                  registrantName: registration.registrantName,
                  eventName: registration.eventName
                }))}&size=200x200" alt="QR Code">
                <div style="margin-top: 10px; font-size: 16px;">${registration.ticketNumber}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Please present this ticket at the event check-in.</p>
              <p>© 2025 BBNAC Convention</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // Generate and share PDF ticket
  const generateAndSharePDF = async () => {
    try {
      setGenerating(true);
      
      // Generate PDF
      const html = generateTicketHTML();
      const { uri } = await Print.printToFileAsync({ html });
      
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Your Ticket',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          'Sharing not available',
          'Sharing is not available on this device'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate or share ticket');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  // Print the ticket directly
  const printTicket = async () => {
    try {
      setGenerating(true);
      
      // Generate HTML
      const html = generateTicketHTML();
      
      // Print
      await Print.printAsync({
        html,
        printerUrl: Platform.OS === 'ios' ? undefined : null, // Only for iOS
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to print ticket');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Ticket</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.eventName}>{registration.eventName}</Text>
            <Text style={styles.ticketNumber}>{registration.ticketNumber}</Text>
          </View>
          
          <View style={styles.ticketBody}>
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Attendee</Text>
              <Text style={styles.infoValue}>{registration.registrantName}</Text>
              
              <Text style={styles.infoLabel}>Registration Type</Text>
              <Text style={styles.infoValue}>{registration.registrationType}</Text>
              
              <Text style={styles.infoLabel}>Registration Date</Text>
              <Text style={styles.infoValue}>{registration.registrationDate}</Text>
              
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: registration.status === 'Confirmed' || registration.status === 'Paid' ? COLORS.successColor : COLORS.warningColor }
              ]}>
                <Text style={styles.statusText}>{registration.status}</Text>
              </View>
            </View>
            
            <View style={styles.barcodeSection}>
              <QRCode
                value={JSON.stringify({
                  ticketNumber: registration.ticketNumber,
                  registrantName: registration.registrantName,
                  eventName: registration.eventName
                })}
                size={200}
                color={COLORS.textDark}
                backgroundColor={COLORS.white}
                getRef={(ref) => setQrRef(ref)}
              />
              <Text style={styles.barcodeText}>{registration.ticketNumber}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={generateAndSharePDF}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="share-outline" size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Share Ticket</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 12, backgroundColor: COLORS.primaryBlue }]}
            onPress={printTicket}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="print" size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Print Ticket</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    backgroundColor: COLORS.primaryBlue,
    padding: 20,
    alignItems: 'center',
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 16,
    color: COLORS.lightBlue,
    textAlign: 'center',
  },
  ticketBody: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: COLORS.textDark,
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  barcodeSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    borderStyle: 'dashed',
  },
  barcodeText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  actionsContainer: {
    marginTop: 24,
  },
  actionButton: {
    backgroundColor: COLORS.secondaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
