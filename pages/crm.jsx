// pages/crm.jsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CRMLayout from '../components/crm/CRMLayout';
import { useToast } from '../components/crm/ToastNotification';

// Initial realistic data seeds
import {
  initialOrders,
  initialCustomers,
  initialProducts,
  initialLeads,
  initialAbandonedCarts,
  initialCampaigns,
  initialCoupons,
  initialSupportTickets,
  initialReviews,
  initialWarehouses,
  initialAuditLogs,
  initialTeam,
  initialIntegrations,
  initialConversations
} from '../components/crm/data/crmData';

// CRM Submodules
import DashboardModule from '../components/crm/modules/DashboardModule';
import OrdersModule from '../components/crm/modules/OrdersModule';
import CustomersModule from '../components/crm/modules/CustomersModule';
import LeadsModule from '../components/crm/modules/LeadsModule';
import ProductsModule from '../components/crm/modules/ProductsModule';
import InventoryModule from '../components/crm/modules/InventoryModule';
import AbandonedCartsModule from '../components/crm/modules/AbandonedCartsModule';
import MarketingModule from '../components/crm/modules/MarketingModule';
import WhatsAppModule from '../components/crm/modules/WhatsAppModule';
import SupportModule from '../components/crm/modules/SupportModule';
import FinanceModule from '../components/crm/modules/FinanceModule';
import CouponsModule from '../components/crm/modules/CouponsModule';
import LoyaltyModule from '../components/crm/modules/LoyaltyModule';
import ReviewsModule from '../components/crm/modules/ReviewsModule';
import AnalyticsModule from '../components/crm/modules/AnalyticsModule';
import ReportsModule from '../components/crm/modules/ReportsModule';
import TeamModule from '../components/crm/modules/TeamModule';
import IntegrationsModule from '../components/crm/modules/IntegrationsModule';
import SettingsModule from '../components/crm/modules/SettingsModule';
import NotificationsModule from '../components/crm/modules/NotificationsModule';

export default function CRMMainPage() {
  const router = useRouter();

  // Active Tab state (defaults to 'dashboard')
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('This month');

  // Application Data States (persisted to localStorage)
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);
  const [leads, setLeads] = useState(initialLeads);
  const [abandonedCarts, setAbandonedCarts] = useState(initialAbandonedCarts);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [tickets, setTickets] = useState(initialSupportTickets);
  const [reviews, setReviews] = useState(initialReviews);
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [team, setTeam] = useState(initialTeam);
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [conversations, setConversations] = useState(initialConversations);

  // Notifications Feed
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New High-Value Acquisition',
      message: 'Princess Gayatri Devi placed order #LX-89421 for ₹5,66,400.',
      type: 'order',
      link: 'orders',
      is_read: false,
      time: '10m ago'
    },
    {
      id: 'notif-2',
      title: 'Foundry Stock Alert',
      message: 'Chrome Deer Sculpture in Mumbai Central Vault has only 4 units remaining.',
      type: 'inventory',
      link: 'inventory',
      is_read: false,
      time: '35m ago'
    },
    {
      id: 'notif-3',
      title: 'New Estate Commission Lead',
      message: 'Nawabzada Zafar Ali Khan submitted inquiry for Rampur estate stallions.',
      type: 'lead',
      link: 'leads',
      is_read: false,
      time: '1h ago'
    },
    {
      id: 'notif-4',
      title: 'White-Glove Delivery Confirmed',
      message: 'Rose-Gold Eagle delivered to Poonawalla Nilgiris stud estate.',
      type: 'order',
      link: 'orders',
      is_read: true,
      time: '3h ago'
    }
  ]);

  // Selected drawers
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  // Read URL query parameter for tab
  useEffect(() => {
    if (router.query.tab && typeof router.query.tab === 'string') {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  // Sync active tab to URL shallowly
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    router.push(`/crm?tab=${tabId}`, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast wrapper
  const toast = useToast();

  // Helper to record audit log
  const recordAudit = (action, module, entityId, description) => {
    const newLog = {
      id: `log-${Date.now()}`,
      user: 'Rajesh Varma (Admin)',
      action,
      module,
      entityId,
      description,
      timestamp: 'Just now',
      ip: '103.21.144.12'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Order Handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
    recordAudit('Status Updated', 'Orders', orderId, `Updated status to "${newStatus}"`);
    toast.showToast(`Order status updated to ${newStatus}`);
  };

  const handleAddOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    recordAudit('Order Created', 'Orders', newOrder.orderNumber, `Acquisition recorded for ₹${newOrder.total.toLocaleString('en-IN')}`);
    toast.showToast(`Order ${newOrder.orderNumber} successfully registered`);
  };

  // Customer Handlers
  const handleAddCustomer = (newCust) => {
    setCustomers((prev) => [newCust, ...prev]);
    recordAudit('Patron Onboarded', 'Customers', newCust.name, `New ${newCust.tier} patron added`);
    toast.showToast(`Patron ${newCust.name} successfully onboarded`);
  };

  const handleUpdateCustomerNotes = (custId, newNotes) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === custId ? { ...c, conciergeNotes: newNotes } : c))
    );
    if (selectedCustomer && selectedCustomer.id === custId) {
      setSelectedCustomer((prev) => ({ ...prev, conciergeNotes: newNotes }));
    }
    toast.showToast('Patron notes updated');
  };

  // Lead Handlers
  const handleUpdateLeadStage = (leadId, newStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, stage: newStage }));
    }
    recordAudit('Stage Advanced', 'Leads', leadId, `Pipeline stage shifted to ${newStage}`);
    toast.showToast(`Lead moved to ${newStage}`);
  };

  const handleAddLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    recordAudit('Lead Added', 'Leads', newLead.leadName, `Inquiry added with deal value ₹${newLead.dealValue.toLocaleString('en-IN')}`);
    toast.showToast(`New lead added for ${newLead.leadName}`);
  };

  // Product Handlers
  const handleAddProduct = (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
    recordAudit('Masterpiece Added', 'Products', newProd.sku, `Added ${newProd.title} to catalog`);
    toast.showToast(`Masterpiece ${newProd.title} published`);
  };

  // Stock Adjustment Handlers
  const handleAdjustStock = (prodId, qtyChange, reason) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const newStock = Math.max(0, p.stock + qtyChange);
          return {
            ...p,
            stock: newStock,
            status: newStock <= 3 ? (newStock === 0 ? 'Out of Stock' : 'Low Stock') : 'Active'
          };
        }
        return p;
      })
    );
    recordAudit('Stock Adjusted', 'Inventory', prodId, `Adjustment of ${qtyChange} units: ${reason}`);
    toast.showToast(`Vault inventory updated (${qtyChange > 0 ? `+${qtyChange}` : qtyChange} units)`);
  };

  // Abandoned Cart Recovery Handler
  const handleTriggerRecovery = (cartId, method) => {
    setAbandonedCarts((prev) =>
      prev.map((c) => {
        if (c.id === cartId) {
          const newStatus = method === 'whatsapp' ? 'WhatsApp Sent' : method === 'email' ? 'Email Sent' : 'Coupon Sent';
          return { ...c, recoveryStatus: newStatus };
        }
        return c;
      })
    );
    recordAudit('Recovery Triggered', 'Abandoned Carts', cartId, `Sent ${method.toUpperCase()} recovery folio`);
    toast.showToast(`Recovery ${method.toUpperCase()} dispatched to patron`);
  };

  // Ticket Handlers
  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    toast.showToast(`Ticket status changed to ${newStatus}`);
  };

  const handleReplyTicket = (ticketId, replyMessage) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            sender: 'Rajesh Varma (Director)',
            type: 'agent',
            time: 'Just now',
            text: replyMessage
          };
          return { ...t, messages: [...t.messages, newMsg], status: 'In Progress' };
        }
        return t;
      })
    );
    toast.showToast('Resolution reply posted to patron');
  };

  // Review Handlers
  const handleUpdateReviewStatus = (revId, status) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, status } : r))
    );
    toast.showToast(`Review marked as ${status}`);
  };

  const handleReplyReview = (revId, replyText) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, reply: replyText } : r))
    );
    toast.showToast('Curatorial appreciation reply published');
  };

  // Conversation Message Handler
  const handleSendMessage = (convId, text) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const newMsg = { sender: 'concierge', text, time: 'Just now' };
          return { ...c, lastMessage: text, time: 'Just now', messages: [...c.messages, newMsg] };
        }
        return c;
      })
    );
    toast.showToast('Verified message sent');
  };

  // Notification Handlers
  const handleMarkNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.showToast('All notifications marked as read');
  };

  // Quick Add Button Action
  const handleQuickAdd = (type) => {
    if (type === 'order') {
      handleSelectTab('orders');
    } else if (type === 'customer') {
      handleSelectTab('customers');
    } else if (type === 'lead') {
      handleSelectTab('leads');
    } else if (type === 'product') {
      handleSelectTab('products');
    } else if (type === 'campaign') {
      handleSelectTab('campaigns');
    }
  };

  // Command Palette Item Selection
  const handleSelectSearchResult = (type, item) => {
    if (type === 'tab') {
      handleSelectTab(item);
    } else if (type === 'order') {
      handleSelectTab('orders');
      setSelectedOrder(item);
    } else if (type === 'customer') {
      handleSelectTab('customers');
      setSelectedCustomer(item);
    } else if (type === 'product') {
      handleSelectTab('products');
      setSelectedProduct(item);
    } else if (type === 'lead') {
      handleSelectTab('leads');
      setSelectedLead(item);
    }
  };

  return (
    <>
      <Head>
        <title>Luxignia CRM & E-Commerce Operating System</title>
      </Head>

      <CRMLayout
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        dateRange={dateRange}
        onChangeDateRange={setDateRange}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onQuickAdd={handleQuickAdd}
        onSelectSearchResult={handleSelectSearchResult}
        data={{ orders, customers, products, leads, abandonedCarts }}
      >
        {/* Render selected active module */}
        {activeTab === 'dashboard' && (
          <DashboardModule
            data={{ orders, customers, products, leads, abandonedCarts }}
            onNavigateTab={handleSelectTab}
            onSelectOrder={(ord) => {
              handleSelectTab('orders');
              setSelectedOrder(ord);
            }}
            onSelectProduct={(p) => {
              handleSelectTab('products');
              setSelectedProduct(p);
            }}
            onSelectCustomer={(c) => {
              handleSelectTab('customers');
              setSelectedCustomer(c);
            }}
            onTriggerRecovery={handleTriggerRecovery}
          />
        )}

        {(activeTab === 'orders' || activeTab === 'returns') && (
          <OrdersModule
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddOrder={handleAddOrder}
            onSelectOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
            onCloseOrderDetail={() => setSelectedOrder(null)}
            products={products}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersModule
            customers={customers}
            orders={orders}
            onSelectCustomer={setSelectedCustomer}
            selectedCustomer={selectedCustomer}
            onCloseCustomerProfile={() => setSelectedCustomer(null)}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomerNotes={handleUpdateCustomerNotes}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsModule
            leads={leads}
            onUpdateLeadStage={handleUpdateLeadStage}
            onAddLead={handleAddLead}
            onSelectLead={setSelectedLead}
            selectedLead={selectedLead}
            onCloseLeadDetail={() => setSelectedLead(null)}
          />
        )}

        {activeTab === 'products' && (
          <ProductsModule
            products={products}
            onSelectProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
            onCloseProductDetail={() => setSelectedProduct(null)}
            onAddProduct={handleAddProduct}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryModule
            products={products}
            warehouses={warehouses}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {activeTab === 'abandoned-carts' && (
          <AbandonedCartsModule
            abandonedCarts={abandonedCarts}
            onTriggerRecovery={handleTriggerRecovery}
          />
        )}

        {activeTab === 'campaigns' && (
          <MarketingModule
            campaigns={campaigns}
            onAddCampaign={(newCamp) => {
              setCampaigns((prev) => [newCamp, ...prev]);
              toast.showToast('Campaign successfully activated');
            }}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppModule
            conversations={conversations}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'support' && (
          <SupportModule
            tickets={tickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onReplyTicket={handleReplyTicket}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceModule
            orders={orders}
          />
        )}

        {activeTab === 'coupons' && (
          <CouponsModule
            coupons={coupons}
            onAddCoupon={(newC) => {
              setCoupons((prev) => [newC, ...prev]);
              toast.showToast(`Coupon ${newC.code} activated`);
            }}
          />
        )}

        {activeTab === 'loyalty' && (
          <LoyaltyModule
            customers={customers}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsModule
            reviews={reviews}
            onUpdateReviewStatus={handleUpdateReviewStatus}
            onReplyReview={handleReplyReview}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsModule />
        )}

        {activeTab === 'reports' && (
          <ReportsModule
            orders={orders}
            customers={customers}
            products={products}
          />
        )}

        {activeTab === 'team' && (
          <TeamModule
            team={team}
            onInviteMember={(newM) => {
              setTeam((prev) => [newM, ...prev]);
              toast.showToast(`Invitation sent to ${newM.email}`);
            }}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsModule
            integrations={integrations}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModule
            auditLogs={auditLogs}
            onSaveSettings={(s) => {
              recordAudit('Settings Saved', 'System', 'Global Config', 'Updated store & tax parameters');
              toast.showToast('System configuration saved');
            }}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsModule
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNavigateTab={handleSelectTab}
          />
        )}
      </CRMLayout>
    </>
  );
}
