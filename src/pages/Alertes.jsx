import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, AlertTriangle, CheckCircle, BellRing, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAlerts, mockWarehouses } from "../data/mock";

export default function Alertes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [dateFilter, setDateFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("Tous");

  const levels = ["Tous", "Élevé", "Moyenne", "Faible"];
  const statuses = ["Tous", "En attente", "En cours de réappro", "Non traité", "Clôturé"];
  const warehouses = ["Tous", ...mockWarehouses.map(w => w.name)];

  const [alerts, setAlerts] = useState(mockAlerts.map((a, i) => ({...a, isNew: i < 2}))); // Les deux premières au hasard pour demo

  const filtered = alerts.filter(a => {
    const matchSearch = a.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      a.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === "Tous" || a.level === levelFilter;
    const matchStatus = statusFilter === "Tous" || a.status === statusFilter;
    const matchDate = dateFilter === "" || a.date.startsWith(dateFilter);
    const matchWarehouse = warehouseFilter === "Tous" || a.warehouse === warehouseFilter;
    return matchSearch && matchLevel && matchStatus && matchDate && matchWarehouse;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Alertes de Stock</h2>
          <p className="text-foreground/60">Gérez les alertes de stock faible, ruptures et limites de capacité.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau Élevé</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter(a => a.level === 'Élevé').length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau Moyen</CardTitle>
            <BellRing className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter(a => a.level === 'Moyenne').length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau Faible</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{alerts.filter(a => a.level === 'Faible').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2 items-center flex-wrap shrink-0">
              <Input type="date" className="h-9 w-auto bg-surface/30 px-3" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
              <select 
                className="h-9 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
              >
                <option value="" disabled>Niveau</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select 
                className="h-9 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="" disabled>Statut</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="h-9 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)}
              >
                <option value="" disabled>Entrepôt</option>
                {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/50" />
              <Input
                placeholder="Rechercher une alerte..."
                className="pl-9 w-full bg-surface/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Niveau</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Produit concerné</TableHead>
                <TableHead>Entrepôt</TableHead>
                <TableHead>Qté Actuelle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alerte) => (
                <TableRow key={alerte.id} className={alerte.status === 'Clôturé' ? 'opacity-60' : ''}>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        {alerte.isNew && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ring-2 ring-blue-500/20" title="Nouvelle" />}
                        <div className={`w-2.5 h-2.5 rounded-full ${alerte.level === 'Élevé' ? 'bg-destructive' : alerte.level === 'Moyenne' ? 'bg-amber-500' : 'bg-primary'}`}></div>
                        <span className="font-medium text-xs scale-100">{alerte.level}</span>
                     </div>
                  </TableCell>
                  <TableCell className="font-medium">{alerte.message}</TableCell>
                  <TableCell>{alerte.product}</TableCell>
                  <TableCell>{alerte.warehouse}</TableCell>
                  <TableCell className={alerte.currentQuantity === 0 ? 'text-destructive font-bold' : ''}>
                    {alerte.currentQuantity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={alerte.status === 'En cours de réappro' ? 'warning' : alerte.status === 'Clôturé' ? 'outline' : 'destructive'}>
                      {alerte.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/70 hover:text-primary" onClick={() => setAlerts(alerts.map(a => a.id === alerte.id ? { ...a, isNew: false } : a))} title="Marquer comme lu">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => navigate("/stocks")}>
                        Traiter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
